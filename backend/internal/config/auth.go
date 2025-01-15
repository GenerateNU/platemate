package config

type Auth struct {
	Secret string `env:"SECRET" envDefault:""`
}
