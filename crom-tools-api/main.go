package main

import (
	"log"
	"os"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

// Global browser instance and Pool
var Browser *rod.Browser
var PagePool chan *rod.Page

func InitBrowser() {
	l := launcher.New().
		Headless(true).
		Set("no-sandbox").
		Set("disable-setuid-sandbox").
		Set("disable-dev-shm-usage")

	url, err := l.Launch()
	if err != nil {
		log.Fatalf("Failed to launch browser: %v", err)
	}

	Browser = rod.New().ControlURL(url).MustConnect()
	log.Println("Browser instance launched.")

	// Initialize Page Pool (Recycling Strategy)
	// We create a fixed pool of pages to avoid overhead of creating targets per request
	poolSize := 5
	PagePool = make(chan *rod.Page, poolSize)

	for i := 0; i < poolSize; i++ {
		// Create incognito pages (independent contexts)
		// Note: For true isolation, we usually want new contexts.
		// Detailed recycling would involve clearing cache/cookies.
		// For this implementation, we use a single Incognito *Browser* Context if possible,
		// or just separate pages. Rod's MustIncognito() returns a NEW browser pointer.
		// To pool effectively:
		// 1. Create a Context?
		// Let's keep it simple: Create pages, put in channel.
		// When getting, check if alive.
		go func() {
			p := Browser.MustIncognito().MustPage() // New Context + Page
			PagePool <- p
		}()
	}
	log.Printf("Initialized Page Pool with %d pages", poolSize)
}

func GetPage() *rod.Page {
	return <-PagePool
}

func PutPage(p *rod.Page) {
	// Simple Reset
	p.MustNavigate("about:blank")
	PagePool <- p
}

func main() {
    InitBrowser()
    defer Browser.MustClose()

    // Initialize Fiber app
    app := fiber.New(fiber.Config{
        // Increase global body limit to support the largest route (Video: 100MB)
        // We set it to 150MB to be safe. Individual routes will restrict this further.
        BodyLimit: 150 * 1024 * 1024, 
        // Enable trusted proxy check if behind Caddy
        EnableTrustedProxyCheck: true,
        TrustedProxies: []string{"127.0.0.1", "::1"}, 
    })

    // Middleware
    // Using default logger for now, can switch to structured if needed but Fiber's logger is decent.
    // User requested "Logs Estruturados". Let's enhance this.
    // User requested "Logs Estruturados". Let's enhance this.
    app.Use(logger.New(logger.Config{
        Format: "{\"time\":\"${time}\", \"ip\":\"${ip}\", \"status\":${status}, \"method\":\"${method}\", \"path\":\"${path}\", \"latency\":\"${latency}\", \"bytes_received\": ${bytes_received}, \"bytes_sent\": ${bytes_sent}}\n",
        TimeFormat: "2006-01-02T15:04:05Z07:00",
    }))

    // CORS Configuration
    app.Use(cors.New(cors.Config{
        AllowOrigins: "https://tools.crom.run, https://crom.run, http://localhost:8080, http://localhost, http://localhost:1234, http://127.0.0.1:1234", 
        AllowHeaders: "Origin, Content-Type, Accept",
        AllowMethods: "GET, POST, OPTIONS",
    }))

    // Security Middleware (Dynamic IP Whitelist)
    // Applied globally.
    app.Use(IPWhitelist())

    // Setup Routes
    SetupRoutes(app)

    // Start server
    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    log.Printf("Starting Crom Tools API on port %s", port)
    log.Fatal(app.Listen(":" + port))
}
