package s3bucket

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type DownloadUrl struct {
	URL string `json:"download_url"`
}

type UploadUrl struct {
	URL string `json:"upload_url"`
	Key string `json:"key"`
}

func (s *Service) GetPresignedUrl(inputs *GetParams) (*DownloadUrl, error) {
	// generate a presigned URL
	req, err := s.Presigner.PresignGetObject(context.Background(), &s3.GetObjectInput{
		Bucket: aws.String(inputs.Bucket),
		Key:    aws.String(inputs.Key),
	})
	if err != nil {
		return nil, err
	}

	return &DownloadUrl{
		URL: req.URL,
	}, nil
}

func (s *Service) CreateUrlAndKey(inputs *PostParams) (*UploadUrl, error) {
	// generate uuid
	fileUUID := uuid.New().String()
	fileKey := fileUUID + "." + inputs.Filetype

	req, err := s.Presigner.PresignPutObject(context.Background(), &s3.PutObjectInput{
		Bucket: aws.String(inputs.Bucket),
		Key:    aws.String(fileKey),
	})
	if err != nil {
		return nil, err
	}
	urlAndKey := &UploadUrl{
		URL: req.URL,
		Key: fileKey,
	}
	return urlAndKey, nil
}
