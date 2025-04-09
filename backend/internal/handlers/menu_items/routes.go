package menu_items

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Router maps endpoints to handlers
*/
func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	service := NewService(collections)
	handler := Handler{service}
	menuGroup := app.Group("/api/v1/menu-items")
	menuGroup.Get("/random", handler.GetRandomMenuItems)
	menuGroup.Get("/popular-with-friends", handler.GetPopularWithFriends)
	menuGroup.Post("/", handler.CreateMenuItem)
	menuGroup.Get("/", handler.GetMenuItems)
	menuGroup.Get("/:id", handler.GetMenuItemById)
	menuGroup.Get("/restaurant/:id", handler.GetMenuItemByRestaurant)
	menuGroup.Get("/:id/simiiar", handler.GetSimilarMenuItems)
	menuGroup.Put("/:id", handler.UpdateMenuItem)
	menuGroup.Delete("/:id", handler.DeleteMenuItem)
	menuGroup.Get("/:id/reviews", handler.GetMenuItemReviews)
	menuGroup.Get("/:id/review-pictures", handler.GetMenuItemReviewPictures)

}
