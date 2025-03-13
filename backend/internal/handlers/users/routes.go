package users

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	service := newService(collections)
	handler := Handler{service}

	// Group under API Version 1
	apiV1 := app.Group("/api/v1")

	// User follow/unfollow endpoints
	user := apiV1.Group("/user")
	user.Get("/:id", handler.GetUserById)

	user.Get("/followers", handler.GetFollowers)
	user.Post("/follow", handler.FollowUser)
	user.Delete("/follow", handler.UnfollowUser)

	// Item review endpoints
	item := apiV1.Group("/item")
	item.Get("/:id/followReviews", handler.GetFollowingReviewsForItem)
	item.Get("/:id/friendReviews", handler.GetFriendReviewsForItem)
}
