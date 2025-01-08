package main

import (
	"context"
	"fmt"
	"github.com/GenerateNU/platemate/internal/xutils"
	"log"
	"os"

	"github.com/GenerateNU/platemate/internal/database"
	"github.com/GenerateNU/platemate/internal/database/scripts"
	"github.com/joho/godotenv"
)

func main() {

	// Load Environment Variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Could not load .env")
	}

	// Connect to Database
	user, pass, cluster := os.Getenv("ATLAS_USER"), os.Getenv("ATLAS_PASS"), os.Getenv("ATLAS_CLUSTER")
	uri := xutils.GenerateAtlasURI(user, pass, cluster)

	client, db, collections, err := database.Connect(context.Background(), uri, os.Getenv("ATLAS_ENVIRONMENT"))

	if err != nil {
		log.Fatalf("Failed to connect to MongoDB")
	}
	// Run operations
	s := scripts.Scripts{
		Db: db, Client: client, Collections: collections,
	}

	err = s.CreateExampleFields("users")

	if err != nil {
		fmt.Println("Error Running Script")
		fmt.Print(err)
	}

	fmt.Println("Finished Executing Database Script")

}
