package mongo

import (
	"context"
	"fmt"
	"log/slog"

	"slices"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/sync/errgroup"
)

/*
Copy a database and put it under a new name
useful for testing schema changes and experimental database operations without affecting other
*/
func (db *DB) Clone(ctx context.Context, collections map[string]*mongo.Collection, name string, limit uint) error {
	eg, egCtx := errgroup.WithContext(ctx)
	eg.SetLimit(int(limit))

	encryptedCollections := []string{"users","enxcol_.users.esc","enxcol_.users.ecoc"}

	for collName, collection := range collections {
		if slices.Contains(encryptedCollections, collName) {continue}
		
		eg.Go(func() error {
			pipeline := []bson.M{
				{"$match": bson.M{
					"name": bson.M{"$nin": bson.A{encryptedCollections}},
				}},
				{"$out": bson.M{
					"db": name, "coll": collName,
				}},
			}
			if _, err := collection.Aggregate(egCtx, pipeline); err != nil {
				return fmt.Errorf("error cloning %s: %w", collName, err)
			}
			slog.LogAttrs(
				egCtx,
				slog.LevelDebug,
				"Collection successfully cloned",
				slog.String("collection_name", collName),
				slog.String("database_name", name),
			)
			return nil
		})
	}

	if err := eg.Wait(); err != nil {
		return fmt.Errorf("failed to clone collections: %w", err)
	}
	return nil
}
