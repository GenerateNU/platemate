package main

import (
	"context"
	"github.com/GenerateNU/platemate/internal/xutils"
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

	user, pass, cluster := os.Getenv("ATLAS_USER"), os.Getenv("ATLAS_PASS"), os.Getenv("ATLAS_CLUSTER")
	uri := xutils.GenerateAtlasURI(user, pass, cluster)

	_, _, collections, err := database.Connect(context.Background(), uri, os.Getenv("ATLAS_ENVIRONMENT"))

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
