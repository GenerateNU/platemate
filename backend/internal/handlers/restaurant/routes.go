package restaurant

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	service := newService(collections)
	handler := Handler{service: service}

	apiV1 := app.Group("/api/v1")

	rest := apiV1.Group("/restaurant")

	rest.Get("/", handler.SearchRestaurants)   // GET /api/v1/restaurant?search=...
	rest.Get("/:id", handler.GetRestaurant)    // GET /api/v1/restaurant/:id
	rest.Put("/:id", handler.UpdateRestaurant) // PUT /api/v1/restaurant/:id
	rest.Delete("/:id", handler.DeleteRestaurant)
}
