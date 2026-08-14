import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger(__name__)

client = None
db = None

def connect_to_db():
    global client, db
    import certifi

    mongodb_url = getattr(settings, "MONGODB_URL", "mongodb://localhost:27017/nexocube")
    
    # Use certifi for SSL connections on Windows/Serverless
    if "mongodb+srv" in mongodb_url:
        client = AsyncIOMotorClient(mongodb_url, tlsCAFile=certifi.where())
    else:
        client = AsyncIOMotorClient(mongodb_url)
    
    # Extract DB name from URL, default to 'nexocube' if not present
    db_name = "nexocube"
    if "/" in mongodb_url.split("mongodb://")[-1]:
        db_name = mongodb_url.split("/")[-1].split("?")[0]
        
    db = client[db_name]
    logger.info(f"Connected to MongoDB database: {db_name}")

def close_db_connection():
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed")

def get_db():
    """FastAPI dependency for MongoDB database instance."""
    global db
    if db is None:
        connect_to_db()
    return db
