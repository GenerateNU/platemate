read -p "Enter Collection Name: " name
go run cmd/db/apply_schema/main.go -coll $name
