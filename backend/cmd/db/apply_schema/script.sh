read -p "Enter Collection Name: " name
go run cmd/db/apply_shema/main.go -coll $name
