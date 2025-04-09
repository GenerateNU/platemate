package auth

import (
	"log"

	"github.com/GenerateNU/platemate/internal/config"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
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

	// User godoc
	// @Summary      Get users
	// @Tags         user
	// @Accept       json
	// @Produce      json
	// @Success      200  {object}  answers.UsersAnswer
	// @Failure      400  {object}  errors.ApiError
	// @Failure      500  {object}  errors.ApiError
	// @Router /v1/users [GET]
	route.Post("/login", handler.Login)
	route.Post("/register", handler.Register)
	route.Post("/logout", handler.Logout)
	route.Post("/refresh", handler.Refresh)
	route.Get("/check-email", handler.CheckEmailExists)
	route.Get("/check-username", handler.CheckUsernameExists)

	api := app.Group("/protected")
	api.Use(handler.AuthenticateMiddleware)
	api.Get("/", handler.Test)
}
