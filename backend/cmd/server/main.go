package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/GenerateNU/platemate/internal/config"
	"github.com/GenerateNU/platemate/internal/server"
	"github.com/GenerateNU/platemate/internal/storage/mongo"
	"github.com/GenerateNU/platemate/internal/xslog"
)

func main() {
	run(os.Stderr, os.Args[1:])
}

func run(stderr io.Writer, args []string) {
	cmd := flag.NewFlagSet("", flag.ExitOnError)
	verboseFlag := cmd.Bool("v", false, "")
	logLevelFlag := cmd.String("log-level", "info", "")
	if err := cmd.Parse(args); err != nil {
		fmt.Fprint(stderr, err)
		os.Exit(1)
	}
	logger := newLogger(*logLevelFlag, *verboseFlag, stderr)
	slog.SetDefault(logger)

	ctx := context.Background()

	config, err := config.Load()
	if err != nil {
		fatal(ctx, "Failed to load config", err)
	}

	db, err := mongo.New(ctx, config.Atlas)
	if err != nil {
		fatal(ctx, "Failed to connect to MongoDB", err)
	}

	app := server.New(db.Collections)

	go func() {
		if err := app.Listen(":8080"); err != nil {
			fatal(ctx, "Failed to start server", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit
	slog.LogAttrs(
		ctx,
		slog.LevelInfo,
		"Stopping server",
	)

	if err := app.Shutdown(); err != nil {
		fatal(ctx, "Failed to shutdown server", err)
	}

	slog.LogAttrs(
		ctx,
		slog.LevelInfo,
		"Server shutdown",
	)

	return
}

func newLogger(logLevel string, verbose bool, stderr io.Writer) *slog.Logger {
	if verbose {
		logLevel = "debug"
	}
	level := slog.LevelInfo.Level()
	switch logLevel {
	case "debug":
		level = slog.LevelDebug.Level()
	case "warn":
		level = slog.LevelWarn.Level()
	case "error":
		level = slog.LevelError.Level()
	}
	return slog.New(slog.NewJSONHandler(stderr, &slog.HandlerOptions{
		AddSource: logLevel == "debug",
		Level:     level,
	}))
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
