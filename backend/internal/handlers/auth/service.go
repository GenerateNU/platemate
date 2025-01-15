package health

import (
	"go.mongodb.org/mongo-driver/mongo"
)

/*
Health Service to be used by Health Handler to interact with the
Database layer of the application
*/
type Service struct {
	users *mongo.Collection
}

func newService(collections map[string]*mongo.Collection) *Service {
	return &Service{collections["users"]}
}
