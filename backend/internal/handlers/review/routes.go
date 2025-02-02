package review

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

	// Add a group for API versioning
	apiV1 := app.Group("/api/v1")

	// Add review group under API Version 1
	review := apiV1.Group("/review")

	review.Post("/", handler.CreateReview)
	review.Get("/", handler.GetReviews)
	review.Get("/:id", handler.GetReview)
	review.Put("/:id", handler.UpdateReview)
	review.Patch("/:id", handler.UpdatePartialReview)
	review.Delete("/:id", handler.DeleteReview)
	review.Get("/:id/comments", handler.GetComments)
	review.Post("/:id/comments", handler.CreateComment)
}
