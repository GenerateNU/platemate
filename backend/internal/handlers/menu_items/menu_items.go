package menu_items

import (
	"errors"
	"fmt"
	"log/slog"
	"strconv"
	"strings"

	"github.com/GenerateNU/platemate/internal/handlers/review"
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

var ValidSortingParams = map[string]bool{
	"portion": true,
	"taste":   true,
	"value":   true,
	"overall": true,
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
	ratings := []float64{avgRating.Portion, avgRating.Taste, avgRating.Value, avgRating.Overall}

	// Loop through each rating field
	for _, rating := range ratings {
		if err := ValidateRating(rating); err != nil {
			return err
		}
	}
	return nil
}

func ValidateRating(rating float64) error {
	if rating <= 1 || rating >= 5 {
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

	// Validate sorting
	validSortFields := map[string]bool{
		"name":              true,
		"avgRating.overall": true,
		"avgRating.portion": true,
		"avgRating.taste":   true,
		"avgRating.value":   true,
		// If we add other fields, add them here
	}
	if queryParams.SortBy != "" {
		if !validSortFields[queryParams.SortBy] {
			return fmt.Errorf("invalid sortBy field: %s", queryParams.SortBy)
		}
		// Sort order can be "asc" (default) or "desc"
		if queryParams.SortOrder != "" &&
			strings.ToLower(queryParams.SortOrder) != "asc" &&
			strings.ToLower(queryParams.SortOrder) != "desc" {
			return fmt.Errorf("invalid sortOrder: %s (must be 'asc' or 'desc')", queryParams.SortOrder)
		}
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

// GetMenuItems retrieves a list of menu items with optional filters
// @Summary      Get menu items
// @Description  Retrieves a list of menu items with optional filtering, sorting, and pagination
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        minRatingPortion     query   number   false  "Minimum portion rating filter"
// @Param        maxRatingPortion     query   number   false  "Maximum portion rating filter"
// @Param        minRatingTaste       query   number   false  "Minimum taste rating filter"
// @Param        maxRatingTaste       query   number   false  "Maximum taste rating filter"
// @Param        minRatingValue       query   number   false  "Minimum value rating filter"
// @Param        maxRatingValue       query   number   false  "Maximum value rating filter"
// @Param        minRatingOverall     query   number   false  "Minimum overall rating filter"
// @Param        maxRatingOverall     query   number   false  "Maximum overall rating filter"
// @Param        tags                 query   []string false  "Filter by tags (comma-separated)"
// @Param        filter               query   []string false  "Filter by dietary restrictions (comma-separated)"
// @Param        limit                query   int      false  "Number of items to return" default(20)
// @Param        skip                 query   int      false  "Number of items to skip" default(0)
// @Param        sortBy               query   string   false  "Field to sort by" Enums(name, avgRating.overall, avgRating.portion, avgRating.taste, avgRating.value) default(name)
// @Param        sortOrder            query   string   false  "Sort order" Enums(asc, desc) default(asc)
// @Param        name                 query   string   false  "Filter by name (text search)"
// @Param        longitude            query   number   false  "Longitude for location-based search"
// @Param        latitude             query   number   false  "Latitude for location-based search"
// @Success      200                  {array}  MenuItemResponse
// @Failure      400                  {object} map[string]string "Invalid request parameters"
// @Failure      500                  {object} map[string]string "Internal server error"
// @Router       /api/v1/menu-items [get]
func (h *Handler) GetMenuItems(c *fiber.Ctx) error {
	// Parse query parameters
	var queryParams MenuItemsQuery
	if err := c.QueryParser(&queryParams); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	// Assign default empty values if nil
	if queryParams.Tags == nil {
		queryParams.Tags = []string{}
	}
	if queryParams.DietaryRestrictions == nil {
		queryParams.DietaryRestrictions = []string{}
	}

	if queryParams.Limit == nil {
		defaultLimit := 20
		queryParams.Limit = &defaultLimit
	}

	// Assign default sorting order if empty
	if queryParams.SortBy == "" {
		queryParams.SortBy = "name"
	}
	if queryParams.SortOrder == "" {
		queryParams.SortOrder = "asc"
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

// GetRandomMenuItems retrieves a random selection of menu items
// @Summary      Get random menu items
// @Description  Returns a random selection of menu items from the database
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        limit    query     int  false  "Number of random items to return" default(20)
// @Success      200      {array}   MenuItemResponse
// @Failure      400      {object}  map[string]string  "Invalid request parameters"
// @Failure      500      {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/random [get]
func (h *Handler) GetRandomMenuItems(c *fiber.Ctx) error {
	limitInput := c.Query("limit", "20")
	limit, err := strconv.Atoi(limitInput)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	items, err := h.service.GetRandomMenuItems(limit)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(items)
}

// GetMenuItemById retrieves a menu item by its ID
// @Summary      Get menu item by ID
// @Description  Returns a specific menu item identified by its ID
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Menu Item ID"
// @Success      200      {object}  MenuItemResponse
// @Failure      400      {object}  map[string]string  "Invalid ID format"
// @Failure      404      {object}  map[string]string  "Menu item not found"
// @Failure      500      {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/{id} [get]
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

// GetMenuItemByRestaurant retrieves menu items for a specific restaurant
// @Summary      Get menu items by restaurant ID
// @Description  Returns all menu items associated with a specific restaurant
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Restaurant ID"
// @Success      200      {array}   MenuItemResponse
// @Failure      400      {object}  map[string]string  "Invalid ID format"
// @Failure      404      {object}  map[string]string  "Restaurant not found"
// @Failure      500      {object}  map[string]string  "Internal server error"
// @Router       /api/v1/restaurant/{id}/menu-items [get]
func (h *Handler) GetMenuItemByRestaurant(c *fiber.Ctx) error {
	id := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	menuItem, err := h.service.GetMenuItemByRestaurant(objID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Menu item", "id", id))
		}
		return err
	}
	return c.Status(fiber.StatusOK).JSON(menuItem)
}

// GetSimilarMenuItems retrieves menu items similar to a specified item
// @Summary      Get similar menu items
// @Description  Returns menu items that are similar to the specified menu item
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        id       path      string  true  "Reference Menu Item ID"
// @Success      200      {array}   MenuItemResponse
// @Failure      400      {object}  map[string]string  "Invalid ID format"
// @Failure      404      {object}  map[string]string  "Menu item not found"
// @Failure      500      {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/{id}/similar [get]
func (h *Handler) GetSimilarMenuItems(c *fiber.Ctx) error {
	id := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	similarItems, err := h.service.GetSimilarMenuItems(objID)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return c.Status(fiber.StatusNotFound).JSON(xerr.NotFound("Menu item", "id", id))
		}
		slog.Error("Error finding similar items", "error", err)
		return err
	}

	return c.Status(fiber.StatusOK).JSON(similarItems)
}

// CreateMenuItem creates a new menu item
// @Summary      Create menu item
// @Description  Creates a new menu item with the provided details
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        menuItem  body      MenuItemRequest  true  "Menu Item details"
// @Success      200       {object}  MenuItemResponse
// @Failure      400       {object}  map[string]string  "Invalid request data"
// @Failure      500       {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items [post]
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

// UpdateMenuItem updates an existing menu item
// @Summary      Update menu item
// @Description  Updates an existing menu item with new details
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        id        path      string           true  "Menu Item ID"
// @Param        menuItem  body      MenuItemRequest  true  "Updated Menu Item details"
// @Success      200       {object}  MenuItemResponse
// @Failure      400       {object}  map[string]string  "Invalid request data or ID format"
// @Failure      404       {object}  map[string]string  "Menu item not found"
// @Failure      500       {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/{id} [put]
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

// DeleteMenuItem deletes a menu item
// @Summary      Delete menu item
// @Description  Deletes an existing menu item by its ID
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        id        path      string  true  "Menu Item ID"
// @Success      200       {object}  MenuItemResponse  "Deleted menu item"
// @Failure      400       {object}  map[string]string  "Invalid ID format"
// @Failure      404       {object}  map[string]string  "Menu item not found"
// @Failure      500       {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/{id} [delete]
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

// GetMenuItemReviews retrieves all reviews for a specific menu item
// @Summary      Get menu item reviews
// @Description  Returns all reviews associated with a specific menu item, with optional filtering by user
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        id        path      string  true   "Menu Item ID"
// @Param        userID    query     string  false  "Filter reviews by specific user ID"
// @Param        sortBy    query     string  false  "Field to sort by" Enums(timestamp, portion, taste, value, overall) default(timestamp)
// @Success      200       {array}   review.ReviewDocument
// @Failure      400       {object}  map[string]string  "Invalid parameters"
// @Failure      500       {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/{id}/reviews [get]
func (h *Handler) GetMenuItemReviews(c *fiber.Ctx) error {
	id := c.Params("id")
	var query MenuItemReviewQuery
	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
		// Invalid ID format
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(errID))
	}

	// Convert user ID only if it's provided
	var userObjID *primitive.ObjectID
	if query.UserID != nil {
		parsedUserID, err := primitive.ObjectIDFromHex(*query.UserID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
		}
		userObjID = &parsedUserID
	}

	var reviews []review.ReviewDocument
	var err error
	sortParam := "timestamp"
	if ValidSortingParams[query.SortBy] {
		sortParam = query.SortBy
	}
	// checks if the menu item reviews should be sorted
	reviews, err = h.service.GetMenuItemReviews(objID, userObjID, sortParam)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(reviews)
}

// GetMenuItemReviewPictures retrieves all review pictures for a menu item
// @Summary      Get menu item review pictures
// @Description  Returns all picture URLs from reviews of a specific menu item
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        id        path      string  true  "Menu Item ID"
// @Success      200       {array}   string  "Array of picture URLs"
// @Failure      400       {object}  map[string]string  "Invalid ID format"
// @Failure      500       {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/{id}/review-pictures [get]
func (h *Handler) GetMenuItemReviewPictures(c *fiber.Ctx) error {
	id := c.Params("id")
	objID, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
		// Invalid ID format
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(errID))
	}
	pictures, err := h.service.GetMenuItemReviewPictures(objID)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(pictures)
}

// GetPopularWithFriends retrieves menu items popular among a user's friends
// @Summary      Get menu items popular with friends
// @Description  Returns menu items that are popular among the user's friends, based on reviews and ratings
// @Tags         menu-items
// @Accept       json
// @Produce      json
// @Param        userId    query     string  true   "User ID"
// @Param        limit     query     int     false  "Number of items to return" default(20)
// @Success      200       {array}   MenuItemResponse
// @Failure      400       {object}  map[string]string  "Invalid parameters"
// @Failure      500       {object}  map[string]string  "Internal server error"
// @Router       /api/v1/menu-items/popular-with-friends [get]
func (h *Handler) GetPopularWithFriends(c *fiber.Ctx) error {
	var query PopularWithFriendsQuery

	if err := c.QueryParser(&query); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}
	userID, err := primitive.ObjectIDFromHex(query.UserId)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(xerr.BadRequest(err))
	}

	items, err := h.service.GetPopularWithFriends(userID, query.Limit)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(xerr.InternalServerError())
	}

	return c.JSON(items)
}
