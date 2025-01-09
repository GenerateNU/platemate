package mongo

import (
	"context"
	"fmt"
	"log/slog"

	"go.mongodb.org/mongo-driver/bson"
)

func (db *DB) CreateExampleFields(ctx context.Context, collection string) error {
	pipeline := bson.A{
		bson.M{
			"$addFields": bson.M{
				"example":    "",
				"exampleTwo": "",
			},
		},
		bson.M{
			"$out": collection,
		},
	}
	if _, err := db.Collections[collection].Aggregate(ctx, pipeline); err != nil {
		return fmt.Errorf("failed to add fields to collection '%s' in '%s': %w", collection, db.DB.Name(), err)
	}
	slog.LogAttrs(
		ctx,
		slog.LevelDebug,
		"Successfully added example fields to collection",
		slog.String("collection", collection),
		slog.String("database_name", db.DB.Name()),
	)
	return nil
}
