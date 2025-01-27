package user_connections

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	service := newService(collections)
	handler := Handler{service}

	apiV1 := app.Group("/api/v1")

	// User connections endpoints
	user := apiV1.Group("/user")
	user.Get("/followers", handler.GetFollowers)
	user.Get("/item/:id/followReviews", handler.GetFollowReviews)
	user.Post("/follow", handler.FollowUser)
	user.Delete("/follow", handler.UnfollowUser)
}
