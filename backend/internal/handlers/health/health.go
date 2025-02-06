package health

import (
	"github.com/gofiber/fiber/v2"
)

/*
Handler to execute business logic for Health Endpoint
*/
type Handler struct {
	service *Service
}

func (h *Handler) GetHealth(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) Ping(c *fiber.Ctx) error {
	// access query params with c
	err := h.service.InsertDocumentToHealth()
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}
