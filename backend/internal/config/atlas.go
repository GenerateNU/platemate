package config

import "fmt"

type Atlas struct {
	User        string `env:"USER"`
	Pass        string `env:"PASS"`
	Cluster     string `env:"CLUSTER"`
	Environment string `env:"ENVIRONMENT"`
}

const placeholderURI string = "mongodb+srv://%s:%s@development.t8bgq.mongodb.net/?retryWrites=true&w=majority&appName=%s"

func (a *Atlas) URI() string {
	return fmt.Sprintf(placeholderURI, a.User, a.Pass, a.Cluster)
}
