import os
import logging
from dotenv import load_dotenv
from pymongo import MongoClient, UpdateOne
from sentence_transformers import SentenceTransformer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Constants
DB_NAME = "ai_law"
COLLECTION_NAME = "law_sections"
MODEL_NAME = "all-MiniLM-L6-v2"
BATCH_SIZE = 100

def generate_embeddings():
    """
    Connects to MongoDB, fetches documents missing embeddings,
    generates embeddings using sentence-transformers, and updates MongoDB.
    """
    # Load environment variables
    # Prioritize MONGO_URI, fallback to MONGO_URL which is seen in groq.env
    load_dotenv()
    # Check both backend root and common env locations if needed
    # (Since script runs from backend root, dotenv should find .env or groq.env)
    load_dotenv("groq.env")
    
    mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGO_URL")
    
    if not mongo_uri:
        logger.error("Error: MONGO_URI or MONGO_URL not found in environment variables.")
        return

    try:
        # Initialize MongoDB client
        client = MongoClient(mongo_uri)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # Initialize Sentence Transformer model
        logger.info(f"Loading model: {MODEL_NAME}...")
        model = SentenceTransformer(MODEL_NAME)
        
        # Find documents without embedding field
        query = {"embedding": {"$exists": False}}
        total_docs = collection.count_documents(query)
        
        if total_docs == 0:
            logger.info("No documents found that require embeddings. All set!")
            return
            
        logger.info(f"Found {total_docs} documents without embeddings. Starting generation...")
        
        cursor = collection.find(query)
        processed_count = 0
        batch_updates = []
        
        for doc in cursor:
            try:
                # Combine fields as requested
                parts = [
                    str(doc.get("act", "")),
                    str(doc.get("section_number", "")),
                    str(doc.get("title", "")),
                    str(doc.get("description", "")),
                    " ".join(doc.get("keywords", [])) if isinstance(doc.get("keywords"), list) else str(doc.get("keywords", ""))
                ]
                
                # Filter out empty strings and join
                text_to_embed = " ".join([p.strip() for p in parts if p and str(p).strip()])
                
                if not text_to_embed.strip():
                    logger.warning(f"Document {doc.get('_id')} has no content to embed. Skipping.")
                    continue
                
                # Generate embedding
                embedding = model.encode(text_to_embed).tolist()
                
                # Prepare update
                batch_updates.append(
                    UpdateOne({"_id": doc["_id"]}, {"$set": {"embedding": embedding}})
                )
                
                processed_count += 1
                
                # Execute updates in batches
                if len(batch_updates) >= BATCH_SIZE:
                    collection.bulk_write(batch_updates)
                    batch_updates = []
                    logger.info(f"Processed {processed_count}/{total_docs} documents...")
                    
            except Exception as e:
                logger.error(f"Error processing document {doc.get('_id')}: {e}")
                continue
                
        # Final batch update
        if batch_updates:
            collection.bulk_write(batch_updates)
            logger.info(f"Processed {processed_count}/{total_docs} documents...")
            
        logger.info("Embedding generation completed successfully.")
        
    except Exception as e:
        logger.error(f"An error occurred during embedding generation: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    generate_embeddings()
