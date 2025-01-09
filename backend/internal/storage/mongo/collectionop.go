package mongo

import "context"

type CollectionOperation func(ctx context.Context, name string) error
