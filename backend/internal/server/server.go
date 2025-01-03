package server

import (
	"github.com/GenerateNU/platemate/errors"
	"github.com/GenerateNU/platemate/internal/handlers/health"
	gojson "github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func New() *fiber.App {

	app := setupApp()

	health.Routes(app)

	return app
}

func setupApp() *fiber.App {
	app := fiber.New(fiber.Config{
		JSONEncoder:  gojson.Marshal,
		JSONDecoder:  gojson.Unmarshal,
		ErrorHandler: errors.ErrorHandler,
	})
	app.Use(recover.New())
	app.Use(requestid.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${ip}:${port} ${pid} ${locals:requestid} ${status} - ${latency} ${method} ${path}\n",
	}))
	app.Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))

	return app
}
