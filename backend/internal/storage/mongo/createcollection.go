package mongo

import (
	"context"
	"fmt"
	"log/slog"

	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
Tool for creating collections with default values
*/
func (db *DB) CreateCollection(ctx context.Context, name string) error {
	validationLevel := "warn"
	schemaValidator := validations[name]
	options := options.CreateCollectionOptions{
		ValidationAction: &validationLevel,
		Validator:        &schemaValidator,
	}
	if err := db.DB.CreateCollection(ctx, name, &options); err != nil {
		return fmt.Errorf("failed to create collection '%s' in '%s': %w", name, db.DB.Name(), err)
	}
	slog.LogAttrs(
		ctx,
		slog.LevelDebug,
		"Collection successfully created",
		slog.String("collection_name", name),
		slog.String("database_name", db.DB.Name()),
	)
	return nil
}
