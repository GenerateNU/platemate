package config

import "github.com/caarlos0/env/v11"

type Config struct {
	App   `envPrefix:"APP_"`
	Atlas `envPrefix:"ATLAS_"`
<<<<<<< HEAD
	Auth  `envPrefix:"AUTH_"`
=======
	AWS   `envPrefix:"AWS_"`
>>>>>>> 8a4cdd07ec0f49451802e1a2b93e9824087872fa
}

func Load() (Config, error) {
	return env.ParseAs[Config]()
}
