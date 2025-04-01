FROM golang:1.23.4

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /platemate-backend ./cmd/server/main.go

EXPOSE 8080

CMD ["/platemate-backend"]