package mongo

import "fmt"

const placeholderUri string = "mongodb+srv://%s:%s@development.t8bgq.mongodb.net/?retryWrites=true&w=majority&appName=%s"

func GenerateAtlasURI(user string, pass string, cluster string) string {
	return fmt.Sprintf(placeholderUri, user, pass, cluster)
}
