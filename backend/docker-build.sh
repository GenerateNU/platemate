docker build --platform linux/amd64 -t abhikaboy/kindred-backend:latest .
docker tag kindred-backend abhikaboy/kindred-backend:latest
docker push abhikaboy/kindred-backend:latest