package xutils

import "fmt"

func GenerateAtlasURI(user string, pass string, cluster string) string {
	placeholderUri := "mongodb+srv://%s:%s@development.t8bgq.mongodb.net/?retryWrites=true&w=majority&appName=%s"
	return fmt.Sprintf(placeholderUri, user, pass, cluster)
}
