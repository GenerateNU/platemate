package xutils

import "crypto/rand"

func GenerateOTP(length int) (string, error) {

	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"

	otp := make([]byte, length)
	randomBytes := make([]byte, length)

	// Generate random bytes in a single call.
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", err
	}

	for i, b := range randomBytes {
		otp[i] = chars[b%byte(len(chars))]
	}

	return string(otp), nil
}
