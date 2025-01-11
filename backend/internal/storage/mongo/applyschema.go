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
	return nil
}
