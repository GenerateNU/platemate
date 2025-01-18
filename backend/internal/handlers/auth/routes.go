package auth

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Router maps endpoints to handlers
*/
func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	service := newService(collections)
	handler := Handler{service}

	route := app.Group("/auth")

	route.Post("/login", handler.Login)
	route.Post("/register", handler.Register)
	route.Post("/logout", handler.Logout)
	route.Post("/forgotPassword", handler.ForgotPassword)
	route.Post("/changePassword", handler.ChangePassword)

	api := app.Group("/protected")
	api.Use(handler.AuthenticateMiddleware)
	api.Get("/", handler.Test)
}
