package health

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

/*
Health Service to be used by Health Handler to interact with the
Database layer of the application
*/
type Service struct {
	health *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{collections["health"]}
}

type PingDocument struct {
	Name    string `bson:"name"`
	Message string `bson:"message"`
}

func (s *Service) InsertDocumentToHealth() error {
	_, err := s.health.InsertOne(context.Background(), PingDocument{Name: "PlateMate Developer", Message: "Hello World!"})
	return err
}
