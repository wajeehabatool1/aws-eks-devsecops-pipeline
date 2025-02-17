// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import the cors middleware
const axios = require("axios");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors()); // Use CORS middleware
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
const dbName = process.env.DB_NAME;

async function initDb() {
  await mongoClient.connect();
  return mongoClient.db(dbName);
}

const dbPromise = initDb();

app.post("/order", async (req, res) => {
  const { customer_name, coffee_details } = req.body;

  try {
    const customerResponse = await axios.get(`${process.env.CUSTOMER_SERVICE_URL}/customers/${customer_name}`);
    const customer = customerResponse.data;

    const db = await dbPromise;
    const result = await db.collection("orders").insertOne({
      customer_name,
      coffee_details,
      status: "Queued",
    });

    await axios.post(`${process.env.QUEUE_SERVICE_URL}/queue`, {
      order_id: result.insertedId,
      customer_name: customer.name,
      customer_email: customer.email,
    });

    res.status(200).json({ message: "Order placed successfully", order_id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Export the app without starting the server
module.exports = app;

// Start the server in a separate file or after tests (if not running for tests)
if (require.main === module) {
  const port = process.env.ORDER_SERVICE_PORT || 8080;
  app.listen(port, () => {
    console.log(`Order Service running on http://localhost:${port}`);
  });
}

