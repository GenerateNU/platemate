read -p "Enter New Environment Name: " name
go run cmd/db/clone_prod/main.go -name $name
