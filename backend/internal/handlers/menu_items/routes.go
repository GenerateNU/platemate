package menu_items

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
	menuGroup := app.Group("/menu-items")

	menuGroup.Post("/", handler.CreateMenuItem)
	// menuGroup.Get("/", handler.GetMenuItem)
	menuGroup.Put("/:id", handler.UpdateMenuItem)
	// menuGroup.Delete("/:id", handler.DeleteMenuItem)

}
