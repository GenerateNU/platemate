package menu_items

import (
	"github.com/gofiber/fiber/v2"
	"log/slog"

)

/*
Handler to execute business logic for Menu Items Endpoint
*/
type Handler struct {
	service *Service
}

type AvgRatingRequest struct {
	Portion float64 `json:"portion"`
	Taste float64 `json:"taste"`
	Value float64 `json:"value"` // implement the validation for ranges
	Overall float64 `json:"overall"`
	Return bool `json:"return"` // @TODO: figure out if boolean or number
}

type MenuItemRequest struct {	
	Name string `json:"name"`
	Picture string `json:"picture"`
	AvgRating AvgRatingRequest `json:"avgRating"`
	Reviews []string `json:"reviews"`
	Description string `json:"description"`
	Location []float64 `json:"location"`
	Tags []string `json:"tags"`
	DietaryRestrictions []string `json:"dietaryRestrictions"`
}

type MenuItemResponse struct {	
	ID string `json:"id"`
	MenuItemRequest
}

// func (h *Handler) GetMenuItem(c *fiber.Ctx) error {
// 	/*
// 	Min rating, max rating
// 	radius, longitude and latitude
// 	limit
// 	pageination
// 	tags that should be present
// 	name should match completely?
// 	how to filter by words in description/name
// 	*/
// 	err := h.service.GetMenuItem()
// 	if err != nil {
// 		return err
// 	}
// 	return c.SendStatus(fiber.StatusOK)
// }

func (h *Handler) CreateMenuItem(c *fiber.Ctx) error {
	var menuItem MenuItemRequest
	if err := c.BodyParser(&menuItem); err != nil { // if parsing fails, return a 400
		// TODO: add in data validation
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request body")
	}
	slog.Info("Received MenuItemRequest", "menuItem", menuItem)

	createdMenuItem, err := h.service.CreateMenuItem(menuItem)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(createdMenuItem)
}


// func (h *Handler) UpdateMenuItem(c *fiber.Ctx) error {
// 	err := h.service.UpdateMenuItem()
// 	if err != nil {
// 		return err
// 	}
// 	return c.SendStatus(fiber.StatusOK)
// }

// func (h *Handler) DeleteMenuItem(c *fiber.Ctx) error {
// 	err := h.service.DeleteMenuItem()
// 	if err != nil {
// 		return err
// 	}
// 	return c.SendStatus(fiber.StatusOK)
// }
