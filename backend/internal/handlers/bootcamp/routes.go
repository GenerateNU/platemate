package bootcamp

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

	app.Group("/bootcamp").Get("/", handler.GetBootcamp)
	app.Group("/bootcamp").Get("/ping", handler.Ping)
}
