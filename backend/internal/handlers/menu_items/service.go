package menu_items

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"log/slog"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
Menu Items Service to be used by Menu Items Handler to interact with the
Database layer of the application
*/
type Service struct {
	menuItems *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	if collections["menuItems"] == nil {
        slog.Info("menuItems collection is nil!")
    }
	return &Service{collections["menuItems"]}
}

type MenuItemDocument struct {
    Name string`bson:"name"`
    Picture string`bson:"picture"`
    AvgRating AvgRating `bson:"avgRating,omitempty"`
	Reviews []string `bson:"reviews"`
	Description string `bson:"description"`
	Location []float64 `bson:"location"`
	Tags []string `bson:"tags"`
	DietaryRestrictions []string `bson:"dietaryRestrictions"`
}

type AvgRating struct {
	Portion *float64 `bson:"portion"`
	Taste *float64 `bson:"taste"`
	Value *float64 `bson:"value"`
	Overall *float64 `bson:"overall"`
	Return *bool `bson:"return"` // @TODO: figure out if boolean or number
}

func ParseMenuItemRequest(menuItemRequest MenuItemRequest) (MenuItemDocument) {
	avgRatingDoc := AvgRating{
		Portion: menuItemRequest.AvgRating.Portion,
		Taste: menuItemRequest.AvgRating.Taste,
		Value: menuItemRequest.AvgRating.Value,
		Overall: menuItemRequest.AvgRating.Overall,
		Return: menuItemRequest.AvgRating.Return,
	}
	menuItemDoc := MenuItemDocument{
		Name: menuItemRequest.Name,
		Picture: menuItemRequest.Picture,
		AvgRating: avgRatingDoc,
		Reviews: menuItemRequest.Reviews,
		Description: menuItemRequest.Description,
		Location: menuItemRequest.Location,
		Tags: menuItemRequest.Tags,
		DietaryRestrictions: menuItemRequest.DietaryRestrictions,
	}

	return menuItemDoc
}

func (s *Service) UpdateMenuItem(id string, menuItemRequest MenuItemRequest) (MenuItemResponse, error) {
	menuItemDoc := ParseMenuItemRequest(menuItemRequest)
	idObj, errID := primitive.ObjectIDFromHex(id)
	if errID != nil {
		slog.Error("Invalid ID", "error", errID)
		return MenuItemResponse{}, errID
	}
	errUpdate := s.menuItems.FindOneAndUpdate(
		context.Background(), 
		bson.M{"_id": idObj}, // filter to match the document
		options.FindOneAndUpdate().SetReturnDocument(options.After), // return the updated document
	).Decode(&menuItemDoc)

	if errUpdate != nil {
		slog.Error("Error updating document", "error", errUpdate)
		return MenuItemResponse{}, errUpdate
	}

	updatedMenuItemResponse := MenuItemResponse{
		ID: id,
		MenuItemRequest: menuItemRequest,
	}
	return updatedMenuItemResponse, nil

}

func (s *Service) CreateMenuItem(menuItemRequest MenuItemRequest) (MenuItemResponse, error) {
	menuItemDoc := ParseMenuItemRequest(menuItemRequest)
	slog.Info("doc", "menuItemDocument", menuItemDoc)

	result, err := s.menuItems.InsertOne(context.Background(), menuItemDoc)
	if err != nil {
		slog.Error("Error inserting document", "error", err)
		return MenuItemResponse{}, err
	}
	slog.Info("Inserted document", "result", result)
	// set the ID of the menuItem to the ID of the inserted document
	menuItemID := result.InsertedID.(primitive.ObjectID).Hex()
	menuItemResponse := MenuItemResponse{
		ID: menuItemID,
		MenuItemRequest: menuItemRequest,
	}
	return menuItemResponse, nil
}
