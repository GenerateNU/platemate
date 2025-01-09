package mongo

import (
	"context"
	"fmt"
	"log/slog"
)

/*
Drop Collection
*/
func (db *DB) DropCollection(ctx context.Context, name string) error {
	if err := db.DB.Collection(name).Drop(ctx); err != nil {
		return fmt.Errorf("failed to drop collection '%s' in '%s': %w", name, db.DB.Name(), err)
	}
	slog.LogAttrs(
		ctx,
		slog.LevelDebug,
		"Collection successfully dropped",
		slog.String("collection_name", name),
		slog.String("database_name", db.DB.Name()),
	)
	return nil
}

/*
Wipe a Database
*/
func (db *DB) DropDatabase(ctx context.Context) error {
	if err := db.DB.Drop(ctx); err != nil {
		return fmt.Errorf("failed to drop database '%s': %w", db.DB.Name(), err)
	}
	slog.LogAttrs(
		ctx,
		slog.LevelDebug,
		"Database successfully dropped",
		slog.String("database_name", db.DB.Name()),
	)
	return nil
}
