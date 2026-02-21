import os
from dotenv import load_dotenv

# Load environment variables from groq.env file
load_dotenv('groq.env')

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGO_URL = os.getenv("MONGO_URL")
MODEL_NAME = "llama-3.1-8b-instant"

# JWT / auth configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-this-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

# Validate required environment variables
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables")
if not MONGO_URL:
    raise ValueError("MONGO_URL not found in environment variables")