"""
Database connection and collection management for Law AI Assistant.
Connects to existing MongoDB database and provides collection references.
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from config import MONGO_URL
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global client instance
_client: Optional[MongoClient] = None
_db = None


def get_mongo_client() -> MongoClient:
    """
    Get or create MongoDB client with connection pooling.
    
    Returns:
        MongoClient: Connected MongoDB client instance
        
    Raises:
        Exception: If connection fails
    """
    global _client
    
    if _client is None:
        try:
            _client = MongoClient(
                MONGO_URL,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                maxPoolSize=50,
                minPoolSize=10
            )
            
            # Test the connection
            _client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise Exception(f"Database connection failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error connecting to MongoDB: {e}")
            raise Exception(f"Database connection error: {str(e)}")
    
    return _client


def get_database():
    """
    Get the ai_law database instance.
    
    Returns:
        Database: MongoDB database instance
    """
    global _db
    
    if _db is None:
        client = get_mongo_client()
        _db = client["ai_law"]
        logger.info("Connected to database: ai_law")
    
    return _db


# Database and collection references
db = get_database()
cases_collection = db["cases"]
law_sections_collection = db["law_sections"]


def create_indexes() -> None:
    """
    Create indexes for better query performance.
    Should be called once during application startup.
    """
    try:
        # Index for keyword-based search in law_sections
        law_sections_collection.create_index("keywords")
        logger.info("Created index on law_sections.keywords")
        
        # Index for timestamp-based queries in cases
        cases_collection.create_index("created_at")
        logger.info("Created index on cases.created_at")
        
        # Compound index for efficient case queries
        cases_collection.create_index([("created_at", -1), ("case_text", "text")])
        logger.info("Created compound index on cases")
        
    except Exception as e:
        logger.warning(f"Index creation warning (may already exist): {e}")


def close_connection() -> None:
    """
    Close the MongoDB connection.
    Should be called on application shutdown.
    """
    global _client, _db
    
    try:
        if _client is not None:
            _client.close()
            _client = None
            _db = None
            logger.info("MongoDB connection closed")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {e}")


def verify_collections() -> dict:
    """
    Verify that required collections exist in the database.
    
    Returns:
        dict: Status of collections with document counts
    """
    try:
        collections = db.list_collection_names()
        
        return {
            "cases": {
                "exists": "cases" in collections,
                "count": cases_collection.count_documents({})
            },
            "law_sections": {
                "exists": "law_sections" in collections,
                "count": law_sections_collection.count_documents({})
            }
        }
    except Exception as e:
        logger.error(f"Error verifying collections: {e}")
        return {}
