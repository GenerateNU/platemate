package auth

import (
	"log"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/GenerateNU/platemate/internal/config"
)

/*
Router maps endpoints to handlers
*/
func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}
	service := newService(collections, cfg)
	handler := Handler{service, cfg}

	route := app.Group("/api/v1/auth")

	route.Post("/login", handler.Login)
	route.Post("/register", handler.Register)
	route.Post("/logout", handler.Logout)

	api := app.Group("/protected")
	api.Use(handler.AuthenticateMiddleware)
	api.Get("/", handler.Test)
}
