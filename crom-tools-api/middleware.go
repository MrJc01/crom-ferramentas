package main

import (
	"encoding/json"
	"log"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
)

// DynamicWhitelist handles IP checking with hot-reload capabilities
type DynamicWhitelist struct {
	allowedIPs map[string]bool
	mu         sync.RWMutex
	filePath   string
}

// Global whitelist instance
var whitelist *DynamicWhitelist

// LoadWhitelist reads IPs from file
func (dw *DynamicWhitelist) Load() {
	content, err := os.ReadFile(dw.filePath)
	if err != nil {
		log.Printf("Error reading whitelist file %s: %v. Using default empty list (deny all except localhost).", dw.filePath, err)
		return
	}

	ips := strings.Split(string(content), "\n")
	newMap := make(map[string]bool)

	for _, ip := range ips {
		trimmed := strings.TrimSpace(ip)
		if trimmed != "" && !strings.HasPrefix(trimmed, "#") {
			newMap[trimmed] = true
		}
	}

	// Always allow localhost for safety in this setup
	newMap["127.0.0.1"] = true
	newMap["::1"] = true

	dw.mu.Lock()
	dw.allowedIPs = newMap
	dw.mu.Unlock()
	log.Printf("Whitelist updated. Allowed IPs: %d", len(newMap))
}

// IsAllowed checks if an IP is in the list
func (dw *DynamicWhitelist) IsAllowed(ip string) bool {
	dw.mu.RLock()
	defer dw.mu.RUnlock()
	return dw.allowedIPs[ip]
}

// Watch starts a ticker to reload the file periodically
// Using ticker is simpler and less error prone than fsnotify for simple use cases in containers.
func (dw *DynamicWhitelist) Watch(interval time.Duration) {
	ticker := time.NewTicker(interval)
	go func() {
		for range ticker.C {
			// Check if file modified? Or just reload. Reload is cheap for small files.
			dw.Load()
		}
	}()
}

// IPWhitelist middleware
func IPWhitelist() fiber.Handler {
	// Initialize the dynamic whitelist
	whitelist = &DynamicWhitelist{
		allowedIPs: make(map[string]bool),
		filePath:   "whitelist.txt",
	}

	// Check if env var override exists for file path
	if envPath := os.Getenv("WHITELIST_FILE"); envPath != "" {
		whitelist.filePath = envPath
	}

	// Initial load
	whitelist.Load()

	// Start watcher (every 30 seconds)
	whitelist.Watch(30 * time.Second)

	return func(c *fiber.Ctx) error {
		clientIP := c.IP()

		if !whitelist.IsAllowed(clientIP) {
			// Structured Log for security event
			logEntry := map[string]interface{}{
				"level":  "warn",
				"event":  "access_denied",
				"ip":     clientIP,
				"path":   c.Path(),
				"time":   time.Now().Format(time.RFC3339),
			}
			jsonLog, _ := json.Marshal(logEntry)
			log.Println(string(jsonLog))

			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Access denied.",
			})
		}
		return c.Next()
	}
}

// MaxBodySize returns a middleware that limits the HTTP body size.
// size is in bytes. e.g., 10 * 1024 * 1024 for 10MB.
func MaxBodySize(size int) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Check Content-Length header first for quick rejection
        // We rely on Fiber's internal body limit check usually, but this is a specific middleware override.
        // Fiber's c.Body() will read up to the global limit.
        // However, to enforce a specific limit per route, we can check here.
        // Note: Fiber's BodyLimit is global.
        // To strictly enforce per-route, we might need to rely on the global limit being high enough,
        // and then check here if we want to RESTRICT it further.
        // But if the global limit is lower, this won't help INCREASE it.
        // Assuming Global Limit is set to High (e.g. 100MB) in main.go
        
        // Simple check if Content-Length > size
        // Note: This is spoofable, but good for honest clients.
			// Ideally we rely on the reader limiting.

		// Fiber doesn't have a per-route body limit easily without reading the body.
		// But we can set the request body limit if we haven't read it yet?
		// No, Fiber reads body for us.
		// Actually, Fiber 2.x reads the body by default.
		
		// If we want to accept Stream, we should use c.Request().BodyStream() which implies not reading it all.
		// But for now, let's just use this middleware to return 413 if it's too big based on header,
		// and rely on global limit for max protection.
		
		if c.Request().Header.ContentLength() > size {
			return c.Status(fiber.StatusRequestEntityTooLarge).JSON(fiber.Map{
				"error": "Request entity too large",
			})
		}
		return c.Next()
	}
}
