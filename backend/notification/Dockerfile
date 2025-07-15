FROM golang:1.24.2-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy

COPY . .

EXPOSE 9000

CMD ["go", "run", "notification_service.go"]

