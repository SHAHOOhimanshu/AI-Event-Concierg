import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ai_event_concierge")

client: AsyncIOMotorClient = None


async def connect_db():
    """Initialize the MongoDB async client."""
    global client
    client = AsyncIOMotorClient(MONGO_URI)
    print(f"✅ Connected to MongoDB at {MONGO_URI}")


async def close_db():
    """Close the MongoDB async client."""
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed.")


def get_db():
    """Return the database instance."""
    return client[DB_NAME]


def get_events_collection():
    """Return the events collection."""
    return get_db()["events"]
