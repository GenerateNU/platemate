package config

type AWS struct {
	BucketName      string `env:"BUCKET_NAME"`
	Region          string `env:"REGION"`
	AccessKeyID     string `env:"ACCESS_KEY_ID"`
	SecretAccessKey string `env:"SECRET_ACCESS_KEY"`
}
