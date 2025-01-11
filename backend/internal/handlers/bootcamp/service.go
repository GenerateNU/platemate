package bootcamp

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
)

/*
Health Service to be used by Health Handler to interact with the
Database layer of the application
*/
type Service struct {
	test *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{collections["test"]}
}

type PingDocument struct {
	Name    string `bson:"name"`
	Message string `bson:"message"`
}

func (s *Service) InsertDocumentToTest() error {
	_, err := s.test.InsertOne(context.Background(), PingDocument{Name: "Suli", Message: "YURRRR"})
	if err != nil {
		fmt.Println(err.Error())
	}
	return err
}