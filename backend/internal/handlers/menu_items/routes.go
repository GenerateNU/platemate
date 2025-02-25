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
	menuGroup := app.Group("/api/v1/menu-items")

	menuGroup.Post("/", handler.CreateMenuItem)
	menuGroup.Get("/", handler.GetMenuItems)
	menuGroup.Get("/:id", handler.GetMenuItemById)
	menuGroup.Put("/:id", handler.UpdateMenuItem)
	menuGroup.Delete("/:id", handler.DeleteMenuItem)
	menuGroup.Get("/:id/reviews", handler.GetMenuItemReviews)
	menuGroup.Get("/:id/reviews/pictures", handler.GetMenuItemReviewPictures)

}
