package bootcamp

import (
	"fmt"

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
	err := h.service.InsertDocumentToTest()
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}