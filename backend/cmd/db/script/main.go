package main

import (
	"context"
	"flag"
	"log/slog"
	"os"

	"github.com/GenerateNU/platemate/internal/config"
	"github.com/GenerateNU/platemate/internal/storage/mongo"
	"github.com/GenerateNU/platemate/internal/xslog"
	"github.com/joho/godotenv"
)

/*
Adds two example fields to the collection passed via
the collection flag.
Example usage: go run cmd/db/example/main.go -collection=collectionName
Applies empty strings as default values
*/
func main() {
	ctx := context.Background()
	collection := flag.String("collection", "users", "collection to add example fields to")
	flag.Parse()
	if *collection == "" {
		fatal(ctx, "collection flag is required", nil)
	}

	if err := godotenv.Load(); err != nil {
		fatal(ctx, "Failed to load .env", err)
	}
	config, err := config.Load()
	if err != nil {
		fatal(ctx, "Failed to load config", err)
	}

	db, err := mongo.New(ctx, config.Atlas)
	if err != nil {
		fatal(ctx, "Failed to connect to MongoDB", err)
	}

	if err := db.CreateCollection(ctx, "reviews"); err != nil {
		fatal(ctx, "Failed to create collection", err)
	} else {
		slog.LogAttrs(ctx, slog.LevelInfo, "Collection created", slog.String("Collection", "users"), slog.String("Environment", db.DB.Name()))
	}
}

func fatal(ctx context.Context, msg string, err error) {
	slog.LogAttrs(
		ctx,
		slog.LevelError,
		msg,
		xslog.Error(err),
	)
	os.Exit(1)
}
