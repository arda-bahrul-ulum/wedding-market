package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/goravel/framework/facades"

	"goravel/bootstrap"
)

func main() {
	// This bootstraps the framework and gets it ready for use.
	bootstrap.Boot()

	// Create a channel to listen for OS signals
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Start HTTP server
	go func() {
		facades.Log().Info("Starting HTTP server...")
		if err := facades.Route().Run(); err != nil {
			facades.Log().Errorf("HTTP server error: %v", err)
		}
	}()

	facades.Log().Info("Application started successfully")

	// Wait for interrupt signal to gracefully shutdown the server
	<-quit
	facades.Log().Info("Shutting down server...")

	// Create a context with timeout for graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Shutdown the server
	if err := facades.Route().Shutdown(); err != nil {
		facades.Log().Errorf("Server shutdown error: %v", err)
		os.Exit(1)
	}

	select {
	case <-ctx.Done():
		facades.Log().Info("Server shutdown timeout exceeded")
	default:
		facades.Log().Info("Server shutdown gracefully")
	}
}
