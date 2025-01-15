package health

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
	app.Group("/health").Get("/logout", handler.Logout)
	app.Group("/health").Get("/forgotPassword", handler.ForgotPassword)
	app.Group("/health").Get("/changePassword", handler.ChangePassword)
}
