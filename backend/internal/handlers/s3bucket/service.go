package s3bucket

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

// func newService(collections map[string]*mongo.Collection) *Service {
// 	return &Service{collections["health"]}
// }

type DownloadUrl struct {
	url    string `bson:"download_url"`
}

type UploadUrl struct {
	url string `bson:"upload_url"`
	key string `bson:"key"`
}

func (inputs *GetParams) GetPresignedUrl() url *DownloadUrl {
	// generate a presigned URL
	req, err := s.Presigner.PresignGetObject(context.Background(), &s3.GetObjectInput{
		Bucket: aws.String(inputs.Bucket),
		Key:    aws.String(inputs.Key),
	})
	if err != nil {
		log.Printf("Error generating presigned URL: %v", err)
		http.Error(w, "Failed to generate presigned URL", http.StatusInternalServerError)
		return
	}
	// get extension from the params 
	return &DownloadUrl{
		url: req.URL
	}, nil
}

// what should be the return type here???
func (inputs *PostParams) CreateUrlAndKey() url *UploadUrl {

	// generate uuid
	fileUUID := uuid.New().String()
	fileKey := fileUUID + "." + fileType

	req, err := s.Presigner.PresignPutObject(context.Background(), &s3.GetObjectInput{
		Bucket: aws.String(inputs.Bucket),
		Key:    fileKey,
		Region: aws.Strings(inputs.Region)
	})
	if err != nil {
		log.Printf("Error generating presigned URL: %v", err)
		http.Error(w, "Failed to generate presigned URL", http.StatusInternalServerError)
		return
	}
	// get extension from the params 
	return &UploadUrl{
		url: req.URL,
		key: fileKey
	}, nil
}
