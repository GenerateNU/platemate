# Build stage
FROM golang:1.23.4 AS builder

# Set working directory
WORKDIR /app

# Copy go mod and sum files first to leverage Docker cache
COPY go.mod go.sum ./
RUN go mod download
COPY .env .env

# Copy the source code
COPY . .

# Build the application
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o /app/backend ./cmd/server/main.go

# Final stage
FROM ubuntu:latest

# Update and install ca-certificates for HTTPS
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/backend /root/backend
COPY .env /root/.env
COPY --from=builder /app/.env /root/.env

# Copy config files if needed
# COPY --from=builder /app/config /root/config

# Expose the port your application runs on
EXPOSE 8080

# Command to run
CMD ["./backend"]
