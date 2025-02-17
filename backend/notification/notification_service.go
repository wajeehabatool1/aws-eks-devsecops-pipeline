package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"github.com/joho/godotenv"
)

type Notification struct {
	OrderID       string `json:"order_id"`
	CustomerName  string `json:"customer_name"`
	CustomerEmail string `json:"customer_email"`
}

var queue = make(chan Notification, 100)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

func queueHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var notification Notification
		err := json.NewDecoder(r.Body).Decode(&notification)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		queue <- notification
		w.WriteHeader(http.StatusAccepted)
		w.Write([]byte("Notification added to queue"))
	}
}

func processQueue() {
	for notification := range queue {
		log.Printf("Processing order: %s for customer: %s", notification.OrderID, notification.CustomerName)
		time.Sleep(5 * time.Second) // Simulate delay

		sendEmail(notification.CustomerEmail, notification.OrderID)

		log.Printf("Notification sent: Order %s is ready for %s", notification.OrderID, notification.CustomerName)
	}
}

func sendEmail(email string, orderID string) {
	from := os.Getenv("EMAIL")
	password := os.Getenv("EMAIL_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	to := []string{email}
	message := []byte("Subject: Coffee Order Ready\n\nYour order " + orderID + " is ready!")

	auth := smtp.PlainAuth("", from, password, smtpHost)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		log.Printf("Failed to send email to %s: %v", email, err)
		return
	}
	log.Printf("Email sent successfully to %s", email)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "9000"
	}

	http.HandleFunc("/queue", queueHandler)

	go processQueue()

	log.Printf("Queue Management Service running on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

