// index.test.js
const request = require("supertest");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const app = require("./index"); // Import the app from index.js

// Mock dependencies
jest.mock("axios");
jest.mock("mongodb", () => {
  const mockMongoClient = {
    connect: jest.fn(),
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: "mockOrderId" }),
      }),
    }),
  };
  return {
    MongoClient: jest.fn(() => mockMongoClient),
  };
});

describe("Order Service Tests", () => {
  it("should place an order successfully", async () => {
    // Mock environment variables
    process.env.CUSTOMER_SERVICE_URL = "http://mock-customer-service";
    process.env.QUEUE_SERVICE_URL = "http://mock-queue-service";
    process.env.MONGO_URI = "mongodb://mockdb";
    process.env.DB_NAME = "mockdb";

    // Mock axios responses
    axios.get.mockResolvedValue({
      data: { name: "John Doe", email: "john.doe@example.com" },
    });
    axios.post.mockResolvedValue({ status: 200 });

    // Mock request payload
    const payload = {
      customer_name: "John Doe",
      coffee_details: { type: "Espresso", size: "Medium" },
    };

    const res = await request(app).post("/order").send(payload);

    // Assertions
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Order placed successfully",
      order_id: "mockOrderId",
    });

    // Verify axios calls
    expect(axios.get).toHaveBeenCalledWith(
      "http://mock-customer-service/customers/John Doe"
    );
    expect(axios.post).toHaveBeenCalledWith(
      "http://mock-queue-service/queue",
      {
        order_id: "mockOrderId",
        customer_name: "John Doe",
        customer_email: "john.doe@example.com",
      }
    );
  });
});

