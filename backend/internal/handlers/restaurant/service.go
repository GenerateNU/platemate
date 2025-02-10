package restaurant

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Service struct {
	restaurants *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{
		restaurants: collections["restaurants"],
	}
}

// SearchRestaurants optionally takes a search string and runs a text query
// If empty -> returns all restaurants.
func (s *Service) SearchRestaurants(search string) ([]RestaurantDocument, error) {
	ctx := context.Background()

	filter := bson.M{}
	if search != "" {
		filter = bson.M{"$text": bson.M{"$search": search}}
	}

	cursor, err := s.restaurants.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []RestaurantDocument
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

// GetRestaurantByID returns a single RestaurantDocument
func (s *Service) GetRestaurantByID(id primitive.ObjectID) (*RestaurantDocument, error) {
	ctx := context.Background()

	var doc RestaurantDocument
	err := s.restaurants.FindOne(ctx, bson.M{"_id": id}).Decode(&doc)
	if err == mongo.ErrNoDocuments {
		// No matching restaurant found
		return nil, mongo.ErrNoDocuments
	} else if err != nil {
		// Different error occurred
		return nil, err
	}
	return &doc, nil
}

// UpdateRestaurant updates an existing document by ID
func (s *Service) UpdateRestaurant(id primitive.ObjectID, updateDoc RestaurantDocument) error {
	ctx := context.Background()

	update := bson.M{
		"$set": bson.M{
			"name":                       updateDoc.Name,
			"description":                updateDoc.Description,
			"address.street":             updateDoc.Address.Street,
			"address.zipcode":            updateDoc.Address.Zipcode,
			"address.state":              updateDoc.Address.State,
			"address.location.latitude":  updateDoc.Address.Location.Latitude,
			"address.location.longitude": updateDoc.Address.Location.Longitude,
			"menuItems":                  updateDoc.MenuItems,
			"style":                      updateDoc.Style,
			"picture":                    updateDoc.Picture,
			"tags":                       updateDoc.Tags,
			"ratingAverage.overall":      updateDoc.RatingAvg.Overall,
			"ratingAverage.return":       updateDoc.RatingAvg.Return,
		},
	}

	filter := bson.M{"_id": id}
	result, err := s.restaurants.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	if result.MatchedCount == 0 {
		// No document found with given ID
		return mongo.ErrNoDocuments
	}
	return nil
}

// DeleteRestaurant removes a restaurant by ID
func (s *Service) DeleteRestaurant(id primitive.ObjectID) error {
	ctx := context.Background()
	filter := bson.M{"_id": id}

	res, err := s.restaurants.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}
