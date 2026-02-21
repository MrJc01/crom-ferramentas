package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/disintegration/imaging"
	"github.com/go-rod/rod/lib/proto"
	"github.com/gofiber/fiber/v2"
)

// Task Queues to limit heavy operations
var OCRQueue = make(chan struct{}, 1)   // Process 1 OCR task at a time
var VideoQueue = make(chan struct{}, 1) // Process 1 Video task at a time

func SetupRoutes(app *fiber.App) {
	v1 := app.Group("/v1")

	// Standard tools
	v1.Post("/convert/pdf", ConvertPDF)
	
	// Image processing (Fallback for large files)
	// Limit to 50MB
	v1.Post("/process/image", MaxBodySize(50*1024*1024), ProcessImage)

	// Heavy Lifting Routes
	// OCR (Limit 10MB)
	v1.Post("/heavy/ocr", MaxBodySize(10*1024*1024), ProcessHeavyOCR)

	// Video Processing (Limit 100MB)
	v1.Post("/heavy/video", MaxBodySize(100*1024*1024), ProcessHeavyVideo)
}

// ConvertPDFRequest - Structure for the request body
type ConvertPDFRequest struct {
	HTML string `json:"html"`
}

// ConvertPDF handles HTML to PDF conversion using Rod (Shared Browser Instance)
func ConvertPDF(c *fiber.Ctx) error {
	var req ConvertPDFRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.HTML == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "HTML content is required"})
	}

    // Reuse global Browser instance
    if Browser == nil {
         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Browser service not initialized"})
    }

    // Create context with timeout to prevent zombies
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    // Create page with context
    // Note: We need to use a context-aware browser clone or just control the page operations with context ideally.
    // Rod's `MustPage` doesn't take context directly but we can use `Context` on the browser.
    
    // Acquire Page from Pool
    page := GetPage()
    defer PutPage(page)

    // Context for timeout
    page.Context(ctx) 
    
    // Set content
	if err := page.SetDocumentContent(req.HTML); err != nil {
         return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to set content: " + err.Error()})
    }
    
    // Wait for network idle
    page.MustWaitLoad()

    // Generate PDF
    pdfStream, err := page.PDF(&proto.PagePrintToPDF{})
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate PDF: " + err.Error()})
    }
    
    // Set headers
    c.Set("Content-Type", "application/pdf")
    c.Set("Content-Disposition", "attachment; filename=document.pdf")

    // Send the stream directly
    return c.SendStream(pdfStream)
}

// ProcessImage handles image processing (resize, format conversion)
// Optimizes memory by streaming response
func ProcessImage(c *fiber.Ctx) error {
	// Parse multipart form
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image file is required"})
	}

	// Open the file
	src, err := file.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to open uploaded file"})
	}
	defer src.Close()

	// Decode image
	img, _, err := image.Decode(src)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid image format"})
	}

    // Get parameters
    action := c.FormValue("action") // resize, convert
    format := c.FormValue("format") // png, jpg, jpeg
    // width := c.FormValue("width") // optional

	var processedImg image.Image = img

	if action == "resize" {
		// Dummy logic for testing
		processedImg = imaging.Resize(img, 800, 0, imaging.Lanczos)
	} else if action == "strip" {
		// Just re-encode to strip metadata
		// No resize needed, processedImg remains as original decoded img
	}

	targetFormat := "jpeg"
	if format != "" {
		targetFormat = format
	}

    qualityStr := c.FormValue("quality") // Expected 0.01 to 1.00 from JS
    qualityInt := 90
    if qualityStr != "" {
        var qf float64
        fmt.Sscanf(qualityStr, "%f", &qf)
        if qf > 0 && qf <= 1 {
            qualityInt = int(qf * 100)
        }
    }

	// Use io.Pipe to stream response without buffering entire result in RAM
	pr, pw := io.Pipe()

	go func() {
		defer pw.Close()
		var err error
		switch targetFormat {
		case "png":
			err = png.Encode(pw, processedImg)
		case "jpg", "jpeg":
			err = jpeg.Encode(pw, processedImg, &jpeg.Options{Quality: qualityInt}) 
        case "webp":
            // Fallback to JPEG if native webp encoder missing without CGO 
            err = jpeg.Encode(pw, processedImg, &jpeg.Options{Quality: qualityInt})
            targetFormat = "jpeg" 
		default:
			err = jpeg.Encode(pw, processedImg, &jpeg.Options{Quality: qualityInt})
		}
		if err != nil {
			fmt.Println("Error encoding image:", err)
		}
	}()

	c.Set("Content-Type", "image/"+targetFormat)
	return c.SendStream(pr)
}

type EncodeError error

// ProcessHeavyOCR handles OCR using Tesseract via os/exec
func ProcessHeavyOCR(c *fiber.Ctx) error {
    // 1. Queue Acquisition (Fail fast if full?)
    // Current channel has buffer 1. If we want to block, we wait. 
    // If we want to fail fast:
    select {
    case OCRQueue <- struct{}{}:
        defer func() { <-OCRQueue }()
    case <-time.After(5 * time.Second):
        return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "OCR Queue full, try again later"})
    }

	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image file is required for OCR"})
	}

	// Tesseract usually needs a file path. We save to temp.
	tempDir := os.TempDir()
	tempFile := filepath.Join(tempDir, fmt.Sprintf("ocr-%d-%s", time.Now().UnixNano(), file.Filename))

	if err := c.SaveFile(file, tempFile); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save temp file"})
	}
	defer os.Remove(tempFile) // Cleanup

    // 2. Command with Context/Timeout
    ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
    defer cancel()

	// Run Tesseract: tesseract input.png stdout
	cmd := exec.CommandContext(ctx, "tesseract", tempFile, "stdout")
	
	// Capture stderr for debugging
	var stderr bytes.Buffer
	cmd.Stderr = &stderr
	
	output, err := cmd.Output()
	if err != nil {
        if ctx.Err() == context.DeadlineExceeded {
            return c.Status(fiber.StatusRequestTimeout).JSON(fiber.Map{"error": "OCR Processing Timeout"})
        }
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "OCR Processing Failed",
			"details": stderr.String(), // Return stderr details
		})
	}

	return c.JSON(fiber.Map{
		"text": string(output),
	})
}

// ProcessHeavyVideo handles video conversion using FFmpeg
func ProcessHeavyVideo(c *fiber.Ctx) error {
    // 1. Queue Acquisition
    select {
    case VideoQueue <- struct{}{}:
        defer func() { <-VideoQueue }()
    case <-time.After(10 * time.Second):
         return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"error": "Video Queue full, try again later"})
    }

	file, err := c.FormFile("video")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Video file is required"})
	}

	tempDir := os.TempDir()
	inputPath := filepath.Join(tempDir, fmt.Sprintf("in-%d-%s", time.Now().UnixNano(), file.Filename))
	outputPath := filepath.Join(tempDir, fmt.Sprintf("out-%d.mp4", time.Now().UnixNano()))

	if err := c.SaveFile(file, inputPath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save input video"})
	}
	defer os.Remove(inputPath)
	defer os.Remove(outputPath)

    // 2. Command with Context/Timeout (Video takes longer)
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
    defer cancel()

	// Run FFmpeg: Convert to MP4 (H.264 + AAC)
	// ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4
	cmd := exec.CommandContext(ctx, "ffmpeg", "-i", inputPath, "-c:v", "libx264", "-c:a", "aac", "-strict", "experimental", "-y", outputPath)
	
	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
        if ctx.Err() == context.DeadlineExceeded {
            return c.Status(fiber.StatusRequestTimeout).JSON(fiber.Map{"error": "Video Processing Timeout"})
        }
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Video Processing Failed",
			"details": stderr.String(),
		})
	}

	// serve the file
	return c.SendFile(outputPath)
}
