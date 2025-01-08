package config

import "github.com/caarlos0/env/v11"

type Config struct {
	App   `envPrefix:"APP_"`
	Atlas `envPrefix:"ATLAS_"`
}

func Load() (Config, error) {
	return env.ParseAs[Config]()
}
