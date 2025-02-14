package menu_items

import (
	"errors"
	"fmt"
	"log/slog"
	"strings"

	"github.com/GenerateNU/platemate/internal/xerr"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Handler to execute business logic for Menu Items Endpoint
*/
type Handler struct {
	service *Service
}

type AvgRatingRequest struct {
	Portion *float64 `json:"portion"`
	Taste   *float64 `json:"taste"`
	Value   *float64 `json:"value"`
	Overall *float64 `json:"overall"`
	Return  *bool    `json:"return"`
}

type MenuItemRequest struct {
	Name                string           `json:"name"`
	Picture             string           `json:"picture"`
	AvgRating           AvgRatingRequest `json:"avgRating"`
	Reviews             []string         `json:"reviews"`
	Description         string           `json:"description"`
	Location            []float64        `json:"location"`
	Tags                []string         `json:"tags"`
	DietaryRestrictions []string         `json:"dietaryRestrictions"`
}

type MenuItemResponse struct {
	ID string `json:"id"`
	MenuItemRequest
}

type MenuItemsQuery struct {
	MinRatingPortion    *float64 `query:"minRatingPortion"`
	MaxRatingPortion    *float64 `query:"maxRatingPortion"`
	MinRatingTaste      *float64 `query:"minRatingTaste"`
	MaxRatingTaste      *float64 `query:"maxRatingTaste"`
	MinRatingValue      *float64 `query:"minRatingValue"`
	MaxRatingValue      *float64 `query:"maxRatingValue"`
	MinRatingOverall    *float64 `query:"minRatingOverall"`
	MaxRatingOverall    *float64 `query:"maxRatingOverall"`
	Tags                []string `query:"tags"`
	DietaryRestrictions []string `query:"filter"`
	Limit               *int     `query:"limit"`
	Skip                int      `query:"skip"`
}

var ValidDietaryRestrictions = map[string]bool{
	"vegan":              true,
	"vegetarian":         true,
	"gluten-free":        true,
	"dairy-free":         true,
	"nut-free":           true,
	"soy-free":           true,
	"egg-free":           true,
	"shellfish-free":     true,
	"low-sodium":         true,
	"high-fiber":         true,
	"ketogenic":          true,
	"paleo":              true,
	"pescatarian":        true,
	"kosher":             true,
	"halal":              true,
	"diabetic-friendly":  true,
	"low-carb":           true,
	"high-protein":       true,
	"raw-food":           true,
	"lactose-intolerant": true,
}

func PreprocessMenuItemRequest(menuItem MenuItemRequest) MenuItemRequest {
	// Default nil arrays to empty
	if menuItem.Reviews == nil {
		menuItem.Reviews = []string{}
	}
	if menuItem.Tags == nil {
		menuItem.Tags = []string{}
	}
	if menuItem.DietaryRestrictions == nil {
		menuItem.DietaryRestrictions = []string{}
	}
	return menuItem
}

func ValidateMenuItemRequest(menuItem MenuItemRequest) error {
	// Ensure name is not empty
	if menuItem.Name == "" {
		return errors.New("name cannot be empty")
	}
	if err := ValidateLocation(menuItem.Location); err != nil {
		return err
	}
	if err := ValidateAvgRatingRequest(menuItem.AvgRating); err != nil {
		return err
	}

	// Validate dietary restrictions
	validRestrictions, err := ValidateDietaryRestrictions(menuItem.DietaryRestrictions)
	if err != nil {
		return err
	}
	menuItem.DietaryRestrictions = validRestrictions

	return nil
}

func ValidateLocation(location []float64) error {
	if len(location) != 2 {
		return errors.New("location must contain exactly 2 values (latitude, longitude)")
	}
	latitude, longitude := location[0], location[1]
	if latitude < -90.0 || latitude > 90.0 {
		return errors.New("latitude must be between -90 and 90")
	}
	if longitude < -180.0 || longitude > 180.0 {
		return errors.New("longitude must be between -180 and 180")
	}
	return nil
}

func ValidateAvgRatingRequest(avgRating AvgRatingRequest) error {
	// Ensure all ratings are [1,5], if provided
	ratings := []*float64{avgRating.Portion, avgRating.Taste, avgRating.Value, avgRating.Overall}

	// Loop through each rating field
	for _, rating := range ratings {
		if rating != nil {
			if err := ValidateRating(*rating); err != nil {
				return err
			}
		}
	}
	return nil
}

func ValidateRating(rating float64) error {
	if rating < 1 || rating > 5 {
		return fmt.Errorf("rating must be between 1 and 5, but got %f", rating)
	}
	return nil
}

func ValidateMinMaxRating(min, max *float64) error {
	// Ensure min and max are within valid bounds
	if min != nil {
		if err := ValidateRating(*min); err != nil {
			return errors.New("min " + err.Error())
		}
	}
	if max != nil {
		if err := ValidateRating(*max); err != nil {
			return errors.New("max " + err.Error())
		}
	}
	// min <= max if both are provided
	if min != nil && max != nil && *min > *max {
		return fmt.Errorf("min rating cannot be greater than max rating, but got min: %f and max: %f", *min, *max)
	}
	return nil
}

func ValidateQueryParams(queryParams MenuItemsQuery) error {
	slog.Info("query params", "query params", queryParams)
	// Validate rating
	if err := ValidateMinMaxRating(queryParams.MinRatingPortion, queryParams.MaxRatingPortion); err != nil {
		return err
	}
	if err := ValidateMinMaxRating(queryParams.MinRatingTaste, queryParams.MaxRatingTaste); err != nil {
		return err
	}
	if err := ValidateMinMaxRating(queryParams.MinRatingValue, queryParams.MaxRatingValue); err != nil {
		return err
	}
	if err := ValidateMinMaxRating(queryParams.MinRatingOverall, queryParams.MaxRatingOverall); err != nil {
		return err
	}

	// Validate dietary restrictions in query params
	if len(queryParams.DietaryRestrictions) > 0 {
		validRestrictions, err := ValidateDietaryRestrictions(queryParams.DietaryRestrictions)
		if err != nil {
			return err
		}
		queryParams.DietaryRestrictions = validRestrictions
	}

	// Validate limit
	if queryParams.Limit != nil && *queryParams.Limit <= 0 {
		return fmt.Errorf("limit must be greater than 0, but got %d", *queryParams.Limit)
	}
	// Validate skip
	if queryParams.Skip < 0 {
		return fmt.Errorf("skip must be greater than or equal to 0, but got %d", queryParams.Skip)
	}

	return nil
}

// Validates and normalizes dietary restrictions
func ValidateDietaryRestrictions(restrictions []string) ([]string, error) {
	if len(restrictions) == 0 {
		return []string{}, nil
	}

	validRestrictions := make([]string, 0)
	for _, restriction := range restrictions {
		normalized := strings.ToLower(strings.TrimSpace(restriction))
		if ValidDietaryRestrictions[normalized] {
			validRestrictions = append(validRestrictions, normalized)
		}
	}

	if len(validRestrictions) == 0 {
		return nil, fmt.Errorf("no valid dietary restrictions found in: %v", restrictions)
	}

	return validRestrictions, nil
}

func (h *Handler) GetMenuItems(c *fiber.Ctx) error {
	// Parse query parameters
	var queryParams MenuItemsQuery
	if err := c.QueryParser(&queryParams); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	if filter := c.Query("filter"); filter != "" {
		queryParams.DietaryRestrictions = strings.Split(filter, ",")
	}

	if err := ValidateQueryParams(queryParams); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	menuItems, err := h.service.GetMenuItems(queryParams)
	if err != nil {
		return err

	}
	return c.Status(fiber.StatusOK).JSON(menuItems)

}

func (h *Handler) GetMenuItemById(c *fiber.Ctx) error {
	id := c.Params("id")
	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
		// Invalid ID format
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(errID))
	}
	menuItem, err := h.service.GetMenuItemById(objID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Menu item", "id", id))
		}
		return err
	}
	return c.Status(fiber.StatusOK).JSON(menuItem)
}

func (h *Handler) CreateMenuItem(c *fiber.Ctx) error {
	var menuItem MenuItemRequest
	if err := c.BodyParser(&menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}
	if err := ValidateMenuItemRequest(menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}
	menuItem = PreprocessMenuItemRequest(menuItem)

	createdMenuItem, err := h.service.CreateMenuItem(menuItem)
	if err != nil {
		if errors.Is(err, ErrInvalidID) {
			return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
		}
		return err
	}
	return c.Status(fiber.StatusOK).JSON(createdMenuItem)
}

/* Updates the menu item with the corresponding ID. Full updates. */
func (h *Handler) UpdateMenuItem(c *fiber.Ctx) error {
	var menuItem MenuItemRequest
	id := c.Params("id")

	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
		// Invalid ID format
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(errID))
	}

	if err := c.BodyParser(&menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}
	if err := ValidateMenuItemRequest(menuItem); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}
	menuItem = PreprocessMenuItemRequest(menuItem)
	updatedMenuItem, err := h.service.UpdateMenuItem(objID, menuItem)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Menu item", "id", id))
		}
		if errors.Is(err, ErrInvalidID) {
			return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
		}
		return err
	}
	return c.Status(fiber.StatusOK).JSON(updatedMenuItem)
}

func (h *Handler) DeleteMenuItem(c *fiber.Ctx) error {
	id := c.Params("id")

	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
		// Invalid ID format
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(errID))
	}

	menuItemDeleted, err := h.service.DeleteMenuItem(objID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Menu item", "id", id))
		}
		return err
	}
	return c.Status(fiber.StatusOK).JSON(menuItemDeleted)
}
