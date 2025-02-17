from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import uvicorn
from pydantic_settings import BaseSettings
import logging


class Settings(BaseSettings):
    MONGODB_URI: str
    DB_NAME: str
    HOST: str
    PORT: int

    class Config:
        env_file = ".env"


settings = Settings()

app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:3000"] for specific origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

client = AsyncIOMotorClient(settings.MONGODB_URI)
db = client[settings.DB_NAME]


class Customer(BaseModel):
    name: str
    email: EmailStr


@app.on_event("startup")
async def startup_event():
    logging.basicConfig(level=logging.INFO)
    logging.info(f"Server is running on http://{settings.HOST}:{settings.PORT}")


@app.post("/register")
async def register_customer(customer: Customer):
    customer_data = {"name": customer.name, "email": customer.email}
    result = await db.customers.insert_one(customer_data)
    return {"customer_id": str(result.inserted_id)}


@app.get("/customers/{customer_name}")
async def get_customer(customer_name: str):
    customer = await db.customers.find_one({"name": customer_name})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {
        "customer_id": str(customer["_id"]),
        "name": customer["name"],
        "email": customer["email"],
    }


if __name__ == "__main__":
    print(f"Starting server on http://{settings.HOST}:{settings.PORT}...")
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)

