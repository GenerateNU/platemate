package user_connections

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	service := newService(collections)
	handler := Handler{service}

	// Group under API Version 1
	apiV1 := app.Group("/api/v1")

	// User connections endpoints
	user := apiV1.Group("/user")

	// Following/Followers endpoints
	user.Get("/followers", handler.GetFollowers)
	user.Get("/following", handler.GetFollowing)
	user.Post("/follow", handler.FollowUser)
	user.Delete("/follow", handler.UnfollowUser)

	// User review-related endpoints that involve following
	user.Get("/feed", handler.GetFollowingFeed)
	user.Get("/item/:id/following-reviews", handler.GetFollowingReviewsForItem)
}
