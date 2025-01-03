package health

import (
	"github.com/gofiber/fiber/v2"
)

func Routes(app *fiber.App) {

	service := newService()

	app.Group("/health").Get("/", service.GetHealth)
}
