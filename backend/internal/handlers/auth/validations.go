package auth

import (
	"fmt"
	"reflect"

	"github.com/gofiber/fiber/v2"
)

func (r *RegisterRequest) Validate() error {
	required := []string{"Email", "Password"}
	err := VerifyRequiredFieldsPresent(required, r)
	return err
}
func (r *LoginRequest) Validate() error {
	required := []string{"Email", "Password"}
	err := VerifyRequiredFieldsPresent(required, r)
	return err
}

func (r *User) Validate() error {
	required := []string{"Email", "Password", "ID", "RefreshToken"}
	err := VerifyRequiredFieldsPresent(required, r)
	return err
}

func VerifyRequiredFieldsPresent(r []string, item interface{}) error {
	v := reflect.ValueOf(item)
	for _, field := range r {
		if !reflect.Indirect(v).FieldByName(field).IsValid() {
			fmt.Println(field)
			fmt.Printf("%+v\n", item)
			return fiber.ErrBadRequest
		}
	}
	return nil
}
