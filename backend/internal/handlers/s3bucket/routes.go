package s3bucket

import (
	"github.com/gofiber/fiber/v2"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Service struct {
	Presigner *s3.PresignClient
}

func newService(presigner *s3.PresignClient) *Service {
	return &Service{
		Presigner: presigner,
	}
}

func Routes(app *fiber.App, presigner *s3.PresignClient) {
	service := newService(presigner)
	handler := Handler{service}

	assets := app.Group("/api/v1/assets")

	assets.Get("/:key/url", handler.GetPresignedUrlHandler)
	assets.Post("/upload", handler.PostPresignedUrlHandler)
}
