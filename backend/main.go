package main

import (
	"context"
	"log"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/GenerateNU/platemate/internal/database"
	"github.com/GenerateNU/platemate/internal/server"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Unable to load .env file.")
	}

	_, _, collections, err := database.Connect(context.Background(), os.Getenv("ATLAS_URI"))

	if err != nil {
		log.Fatalf("Failed to connect to MongoDB.")
	}

	app := server.New(collections)

	go func() {
		if err := app.Listen(":8080"); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
		slog.Info("Server Running!")
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit

	slog.Info("Shutting down server")
	if err := app.Shutdown(); err != nil {
		slog.Error("failed to shutdown server", "error", err)
	}

	slog.Info("Server shutdown")
}
