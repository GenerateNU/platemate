package main

import (
	"context"
	"fmt"
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
		log.Fatal(err)
	}

	// Connect to Database
	client, db, collections, err := database.Connect(context.Background(), os.Getenv("ATLAS_URI"))

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
