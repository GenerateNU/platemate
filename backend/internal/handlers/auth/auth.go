package health

import "github.com/gofiber/fiber/v2"

/*
Handler to execute business logic for Health Endpoint
*/
type Handler struct {
	service *Service
}

func (h *Handler) Login(c *fiber.Ctx) error { 
	return fiber.NewError(400,"Not Implemented")
}

func (h *Handler) Logout(c *fiber.Ctx) error { 
	return fiber.NewError(400,"Not Implemented")
}

func (h *Handler) ForgotPassword(c *fiber.Ctx) error { 
	return fiber.NewError(400,"Not Implemented")
}

func (h *Handler) ChangePassword(c *fiber.Ctx) error {	
	return fiber.NewError(400,"Not Implemented")	
}
