package users

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	service := NewService(collections)
	handler := Handler{service}

	// Group under API Version 1
	apiV1 := app.Group("/api/v1")

	// User follow/unfollow endpoints
	user := apiV1.Group("/user")
	user.Get("/:id", handler.GetUserById)

	user.Get("/followers", handler.GetFollowers)
	user.Get("/:id/following", handler.GetFollowing)
	user.Post("/follow", handler.FollowUser)
	user.Delete("/follow", handler.UnfollowUser)

	// Item review endpoints
	item := apiV1.Group("/item")
	item.Get("/:id/followReviews", handler.GetFollowingReviewsForItem)
	item.Get("/:id/friendReviews", handler.GetFriendReviewsForItem)

	app.Get("/api/v1/user", handler.GetUsers) // FOR TESTING PURPOSES ONLY

	// User settings
	settings := apiV1.Group("/settings")
	settings.Get("/:id/dietaryPreferences", handler.GetDietaryPreferences)
	settings.Post("/:id/dietaryPreferences", handler.PostDietaryPreferences)
	settings.Delete("/:id/dietaryPreferences", handler.DeleteDietaryPreferences)
}
