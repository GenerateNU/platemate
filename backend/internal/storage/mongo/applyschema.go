package mongo

import (
	"context"
	"fmt"
	"log/slog"

	"go.mongodb.org/mongo-driver/bson"
)

/*
Modify a collection by applying a schema specified in ./validations.go
pass in name of collection to apply new schema
*/
func (db *DB) ApplySchema(ctx context.Context, name string) error {
	command := bson.D{
		{Key: "collMod", Value: name},
		{Key: "validator", Value: validations[name]},
		{Key: "validationLevel", Value: "strict"},
		{Key: "validationAction", Value: "error"},
	}
	if err := db.DB.RunCommand(ctx, command).Err(); err != nil {
		return fmt.Errorf("failed to apply schema to collection '%s' in '%s': %w", name, db.DB.Name(), err)
	}
	slog.LogAttrs(
		ctx,
		slog.LevelDebug,
		"Schema successfully applied",
		slog.String("collection_name", name),
		slog.String("database_name", db.DB.Name()),
	)

	command = bson.D{
		{Key: "validate", Value: name},
		{Key: "full", Value: true},
		{Key: "scandata", Value: true},
	}

	var result bson.M
	res := db.DB.RunCommand(ctx, command)
	err := res.Decode(&result)
	if err != nil {
		return fmt.Errorf("failed to validate collection '%s' in '%s': %w", name, db.DB.Name(), err)
	}

	fmt.Printf("result: %v\n", &result)
	if err := res.Err(); err != nil {
		return fmt.Errorf("failed to validate collection '%s' in '%s': %w", name, db.DB.Name(), err)
	}

	colls, err := db.DB.ListCollections(ctx, bson.D{
		{Key: "name", Value: name},
	})
	if err != nil {
		return fmt.Errorf("failed to list collections in '%s': %w", db.DB.Name(), err)
	}

	var collRes bson.M
	// print the collections
	colls.Next(ctx)
	err = colls.Decode(&collRes)
	if err != nil {
		return fmt.Errorf("failed to decode collections in '%s': %w", db.DB.Name(), err)
	}
	fmt.Print("\n\n\n")
	// fmt.Printf("result: %v\n", &collRes)

	return nil
}
