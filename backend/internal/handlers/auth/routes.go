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
	
	route.Get("/login", handler.Login)
	route.Get("/register", handler.Register)
	route.Get("/logout", handler.Logout)
	route.Get("/forgotPassword", handler.ForgotPassword)
	route.Get("/changePassword", handler.ChangePassword)
}
