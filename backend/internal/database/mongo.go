package database

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"os"
	"slices"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connect(ctx context.Context, uri string) (*mongo.Client, *mongo.Database, map[string]*mongo.Collection, error) {

	// Setup Client
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	// Connect to the database
	client, err := mongo.Connect(ctx, opts)
	if err != nil {
		panic(err)
	}

	// Ping the database to ensure the connection is working
	var result bson.M
	if err := client.Database("admin").RunCommand(ctx, bson.D{{Key: "ping", Value: 1}}).Decode(&result); err != nil {
		log.Fatal("Ping Failed")
		panic(err)
	}

	// Validate Environment Passed is Valid
	env := os.Getenv("ENVIRONMENT")
	envList, err := client.ListDatabaseNames(context.Background(), bson.D{})

	if err != nil {
		log.Fatal(err)
	}

	if !slices.Contains(envList, env) {
		fmt.Println("Invalid Database Environment passed")
		fmt.Println("Please choose from the following: ")
		for i, v := range envList {
			fmt.Printf("[%d] %s \n", i, v)
		}
		slog.Error("Invalid Database Environment passed")
	}

	// Create Map of Collections
	db := client.Database(env)
	collectionNames, err := db.ListCollectionNames(context.Background(), bson.D{})
	if err != nil {
		slog.Error("Unable to fetch collections")
	}

	collections := make(map[string]*mongo.Collection)

	for _, name := range collectionNames {
		collections[name] = db.Collection(name)
	}

	fmt.Println("Connected to MongoDB.")

	return client, db, collections, err

}
