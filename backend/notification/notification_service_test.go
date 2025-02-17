package main

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestQueueHandler(t *testing.T) {
    // Mock the request body
    notification := Notification{
        OrderID:       "12345",
        CustomerName:  "John Doe",
        CustomerEmail: "john.doe@example.com",
    }

    // Convert the notification struct to JSON
    notificationJSON, err := json.Marshal(notification)
    if err != nil {
        t.Fatalf("Error marshaling notification: %v", err)
    }

    // Create a new HTTP request
    req := httptest.NewRequest(http.MethodPost, "/queue", bytes.NewReader(notificationJSON))
    w := httptest.NewRecorder()

    // Call the queue handler
    queueHandler(w, req)

    // Check the status code
    if w.Result().StatusCode != http.StatusAccepted {
        t.Errorf("Expected status %v but got %v", http.StatusAccepted, w.Result().StatusCode)
    }

    // Check the response body
    expectedResponse := "Notification added to queue"
    if w.Body.String() != expectedResponse {
        t.Errorf("Expected body %v but got %v", expectedResponse, w.Body.String())
    }
}

