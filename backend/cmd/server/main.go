package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log/slog"
	"os"
	"os/exec"
	"os/signal"
	"runtime"
	"strconv"
	"strings"
	"syscall"

	"github.com/GenerateNU/platemate/internal/config"
	"github.com/GenerateNU/platemate/internal/server"
	"github.com/GenerateNU/platemate/internal/storage/mongo"
	"github.com/GenerateNU/platemate/internal/xslog"
	"github.com/joho/godotenv"
)

func main() {
	run(os.Stderr, os.Args[1:])
}

func run(stderr io.Writer, args []string) {

	cmd := flag.NewFlagSet("", flag.ExitOnError)
	verboseFlag := cmd.Bool("v", false, "")
	logLevelFlag := cmd.String("log-level", slog.LevelDebug.String(), "")
	if err := cmd.Parse(args); err != nil {
		fmt.Fprint(stderr, err)
		os.Exit(1)
	}
	logger := newLogger(*logLevelFlag, *verboseFlag, stderr)
	slog.SetDefault(logger)

	ctx := context.Background()

	if err := godotenv.Load(); err != nil {
		fatal(ctx, "Failed to load .env", err)
	}

	config, err := config.Load()
	if err != nil {
		fatal(ctx, "Failed to load config", err)
	}

	port, err := strconv.Atoi(config.App.Port)
	if err != nil {
		fatal(ctx, "Failed to convert port to int", err)
	}
	if err := killProcessOnPort(port); err != nil {
		slog.LogAttrs(ctx, slog.LevelError, "Failed to kill process on port", slog.Int("port", port), slog.String("error", err.Error()))
	} else {
		slog.LogAttrs(ctx, slog.LevelInfo, "Process on port killed successfully", slog.Int("port", port))
	}

	db, err := mongo.New(ctx, config.Atlas)
	if err != nil {
		fatal(ctx, "Failed to connect to MongoDB", err)
	}

	app := server.New(db.Collections)

	go func() {
		if err := app.Listen(":" + config.App.Port); err != nil {
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

func killProcessOnPort(port int) error {
	var cmd *exec.Cmd
	var output []byte
	var err error

	switch runtime.GOOS {
	case "windows":
		output, err = exec.Command("netstat", "-ano", "|", "findstr", ":"+strconv.Itoa(port)).Output()
		if err != nil {
			return fmt.Errorf("failed to find process: %w", err)
		}
		pid := strings.Fields(string(output))[4]
		cmd = exec.Command("taskkill", "/F", "/PID", pid)

	case "darwin", "linux":
		output, err = exec.Command("lsof", "-i", ":"+strconv.Itoa(port)).Output()
		if err != nil {
			return fmt.Errorf("failed to find process: %w", err)
		}
		lines := strings.Split(string(output), "\n")
		if len(lines) < 2 {
			return fmt.Errorf("no process found listening on port %d", port)
		}
		pid := strings.Fields(lines[1])[1]
		cmd = exec.Command("kill", "-9", pid)

	default:
		return fmt.Errorf("unsupported operating system: %s", runtime.GOOS)
	}

	err = cmd.Run()
	if err != nil {
		return fmt.Errorf("failed to kill process: %w", err)
	}

	return nil
}
