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

	app.Group("/auth").Get("/login", handler.Login)
	app.Group("/auth").Get("/register", handler.Register)
	app.Group("/auth").Get("/logout", handler.Logout)
	app.Group("/auth").Get("/forgotPassword", handler.ForgotPassword)
	app.Group("/auth").Get("/changePassword", handler.ChangePassword)
}
