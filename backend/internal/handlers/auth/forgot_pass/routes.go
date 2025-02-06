package forgot_pass

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

	apiV1 := app.Group("/api/v1")
	userV1 := apiV1.Group("/user")

	userV1.Post("/forgot-password", handler.ForgotPassword)
	userV1.Get("/verify-otp", handler.VerifyOTP)
	userV1.Post("/change-password", handler.ChangePassword)
}
