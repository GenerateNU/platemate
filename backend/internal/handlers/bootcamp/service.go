package bootcamp

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

/*
Bootcamp Service to be used by Bootcamp Handler to interact with the
Database layer of the application
*/
type Service struct {
	test *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{collections["test"]}
}

type PingDocument struct {
	Name        string   `bson:"name"`
	Sandwich    string   `bson:"sandwich"`
	Ingredients []string `bson:"ingredients"`
}

func (s *Service) InsertDocumentToBootcamp() error {
	_, err := s.test.InsertOne(context.Background(), PingDocument{Name: "Dylan Anctil", Sandwich: "Chicken Cutlet", Ingredients: []string{"Chicken", "Bread", "Lettuce", "Tomato", "Mayo"}})
	return err
}
