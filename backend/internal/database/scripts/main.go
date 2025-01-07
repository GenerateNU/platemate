package main

import (
	"context"
	"log"
	"os"

	"github.com/GenerateNU/platemate/internal/database"
	"github.com/GenerateNU/platemate/internal/database/utils"
	"github.com/joho/godotenv"
)

func main() {

	// Load Environment Variables 
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Could not load .env")
		log.Fatal(err)
	}

	// Connect to Database
 	client, _, _, err := database.Connect(context.Background(), os.Getenv("ATLAS_URI"))

	if err != nil {
		log.Fatalf("Failed to connect to MongoDB")
	}
	// Run operations 
	utils.BulkOperation(client,utils.DropCollection, "health")
	utils.BulkOperation(client,utils.CreateCollection, "health")
	
}