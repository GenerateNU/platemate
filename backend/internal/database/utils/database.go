package utils

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
	Perform a collection operation across all environments
	 * Do not preform unless given approval from a Tech Lead
*/

func BulkOperation(client *mongo.Client, operation CollectionOperation, arg string) {
	databaseNames, err := client.ListDatabaseNames(context.Background(), bson.D{})
	if err != nil {
		panic(err)
	}
	for _, name := range databaseNames {
		if name == "admin" || name == "local" {
			return
		}
		operation(client.Database(name), arg)
	}
}

type CollectionOperation func(db *mongo.Database, name string)

/*
Tool for creating collections with default values
*/
func CreateCollection(db *mongo.Database, name string) {
	validationLevel := "warn"
	schemaValidator := get_validations()[name]

	options := options.CreateCollectionOptions{
		ValidationAction: &validationLevel,
		Validator:        &schemaValidator,
	}

	err := db.CreateCollection(context.Background(), name, &options)

	if err != nil {
		fmt.Printf("Unable to Create Collection `%s` in %s \n%s\n", name, db.Name(), err)
	} else {
		fmt.Printf("Collection `%s` Created in %s\n", name, db.Name())
	}
}

/*
	Drop Collection
*/

func DropCollection(db *mongo.Database, name string) {
	err := db.Collection(name).Drop(context.Background())
	if err != nil {
		fmt.Printf("Unable to Drop Collection `%s` \n%s\n", name, err)
	} else {
		fmt.Printf("Collection `%s` Drop\n", name)
	}
}

/*
Modify a collection by applying a schema specified in ./validations.go
pass in name of collection to apply new schema
*/
func ApplySchema(db *mongo.Database, name string) {
	command := bson.D{
		{Key: "collMod", Value: name},
		{Key: "validator", Value: get_validations()[name]},
	}
	db.RunCommand(context.Background(), command)
	fmt.Printf("Schema Applied to %s\n", name)
}

/*
	Copy a database and put it under a new name
	useful for testing schema changes and experimental database operations without affecting other
*/

func Clone(collections map[string]*mongo.Collection, name string) {
	for collName, collection := range collections {
		pipeline := []bson.M{
			bson.M{"$match": bson.M{}},
			bson.M{"$out": bson.M{
				"db": name, "coll": collName,
			}},
		}

		_, err := collection.Aggregate(context.Background(), pipeline)

		if err != nil {
			fmt.Printf("Error Cloning %s\n", collName)
		} else {
			fmt.Printf("Cloned %s\n", collName)
		}
	}
}

/*
	Wipe a Database
*/

func DropDatabase(db *mongo.Database) {
	name := db.Name()
	err := db.Drop(context.Background())
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println("Database `" + name + "` Dropped")
	}
}
