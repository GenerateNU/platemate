package restaurant

import (
	"github.com/GenerateNU/platemate/internal/handlers/menu_items"
	"github.com/GenerateNU/platemate/internal/handlers/review"
	"github.com/GenerateNU/platemate/internal/handlers/users"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	userConnectionsService := users.NewService(collections)
	menuItemsService := menu_items.NewService(collections)
	reviewService := review.NewService(collections)
	service := newService(collections, userConnectionsService, menuItemsService, reviewService)
	handler := Handler{service: service}

	apiV1 := app.Group("/api/v1")

	rest := apiV1.Group("/restaurant")

	rest.Get("/", handler.SearchRestaurants)            // GET /api/v1/restaurant?search=...
	rest.Get("/:id", handler.GetRestaurant)             // GET /api/v1/restaurant/:id
	rest.Put("/:id", handler.UpdateRestaurant)          // PUT /api/v1/restaurant/:id (full update)
	rest.Patch("/:id", handler.UpdatePartialRestaurant) // PATCH /api/v1/restaurant/:id (partial update)
	rest.Delete("/:id", handler.DeleteRestaurant)
	rest.Get("/:rid/super-stars", handler.GetSuperStars)
	rest.Get("/:uid/:rid", handler.GetRestaurantFriendsFav)
}
