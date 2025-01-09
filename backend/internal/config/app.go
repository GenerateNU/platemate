package config

type App struct {
	Port string `env:"PORT" envDefault:"8080"`
}
