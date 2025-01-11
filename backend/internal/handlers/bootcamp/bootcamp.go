package bootcamp

import (
	"github.com/gofiber/fiber/v2"
)

/*
Handler to execute business logic for Bootcamp Endpoint
*/
type Handler struct {
	service *Service
}

func (h *Handler) GetBootcamp(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusOK)
}

func (h *Handler) Ping(c *fiber.Ctx) error {
	err := h.service.InsertDocumentToBootcamp()
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}
