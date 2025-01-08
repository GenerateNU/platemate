package mongo

import "go.mongodb.org/mongo-driver/mongo"

type CollectionOperation func(db *mongo.Database, name string) error
