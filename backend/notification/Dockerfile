FROM golang:1.25.3-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy

COPY . .

EXPOSE 9000

CMD ["go", "run", "notification_service.go"]

