package auth

import "github.com/gofiber/fiber/v2"

func (r *RegisterRequest) Validate() error {
	if r.Email == "" || r.Password == "" {
		return fiber.ErrBadRequest
	} 
	return nil
}
func (r *LoginRequest) Validate() error {
	if r.Email == "" || r.Password == "" {
		return fiber.ErrBadRequest
	} 
	return nil
}

func (r *User) Validate() error {
	if r.Email == "" || r.Password == "" {
		return fiber.ErrBadRequest
	} 
	return nil
}
