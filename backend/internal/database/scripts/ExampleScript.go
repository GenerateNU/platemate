package scripts

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Scripts struct {
	Db *mongo.Database 
	Client *mongo.Client
	Collections map[string]*mongo.Collection
}

/*
	Adds two example fields to the collection passed
	Applies empty strings as default values
*/
func (s *Scripts) CreateExampleFields(collection string) error {
	fmt.Println("Running Create Example Fields")
	pipeline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"example": "", 
				"exampleTwo": "", 
			},
		},
		bson.M{
			"$out": collection,
		},
	}
	
	_, err := s.Collections[collection].Aggregate(context.Background(), pipeline)

	return err
}