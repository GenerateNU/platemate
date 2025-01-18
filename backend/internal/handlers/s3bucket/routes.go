package s3bucket

import (
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Router maps endpoints to handlers
*/
func Routes(app *fiber.App, collections map[string]*mongo.Collection) {
	// Initialize S3 service ?
	service := newService(collections)
	handler := Handler{service}

	assets := app.Group("/api/v1/assets")

	assets.Get("/:key/url", handler.GetPresignedUrl)
	assets.Post("/upload", handler.PostPresignedUrlHandler)
}
