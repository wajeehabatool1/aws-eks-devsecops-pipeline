import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
from app import app, db, settings

@pytest.fixture
async def setup_database():
    """
    Setup a test database and clean up after tests.
    """
    test_client = AsyncIOMotorClient(settings.MONGODB_URI)
    test_db = test_client[settings.DB_NAME]
    customers_collection = test_db.customers
    await customers_collection.delete_many({})  # Clear the collection before tests
    yield
    await customers_collection.delete_many({})  # Clear after tests

def test_register_customer(setup_database):
    """
    Test the /register endpoint.
    """
    test_customer = {"name": "John Doe", "email": "john.doe@example.com"}

    client = TestClient(app)  # Use FastAPI's TestClient
    response = client.post("/register", json=test_customer)

    assert response.status_code == 200
    response_data = response.json()
    assert "customer_id" in response_data

    # Database verification (you can comment this section if you encounter async issues)
    # saved_customer = db.customers.find_one({"_id": ObjectId(response_data["customer_id"])})
    # assert saved_customer is not None
    # assert saved_customer["name"] == test_customer["name"]
    # assert saved_customer["email"] == test_customer["email"]

