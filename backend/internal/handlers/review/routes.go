package review

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

	// Add a group for API versioning
	apiV1 := app.Group("/api/v1")

	// Add review group under API Version 1
	review := apiV1.Group("/review")

	
		// get a user's reviews for a restaurant
		review.Get("/:rid/user/:uid/reviews", handler.GetUserReviewsByRestaurant)
	
		// get all reviews for a restaurant
		review.Get("/:rid/reviews", handler.GetAllReviewsByRestaurant)

		
	review.Post("/", handler.CreateReview)
	review.Get("/", handler.GetReviews)
	review.Get("/:id", handler.GetReview)
	review.Put("/:id", handler.UpdateReview)
	review.Patch("/:id", handler.UpdatePartialReview)
	review.Delete("/:id", handler.DeleteReview)
	review.Get("/:id/comments", handler.GetComments)
	review.Post("/:id/comments", handler.CreateComment)

	review.Post("/:id/vote", handler.Vote)
	review.Get("/:id/vote", handler.GetLikers)

	review.Get("/user/:userId", handler.GetReviewsByUser)
	review.Get("/user/:userId/search", handler.SearchUserReviews)

	review.Get("/user/:userId/top", handler.GetTopReviews)
}
