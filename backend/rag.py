"""
RAG (Retrieval-Augmented Generation) module for legal section retrieval.
Implements keyword-based search to find relevant law sections.
"""

from database import law_sections_collection
import logging
import re
from typing import List

logger = logging.getLogger(__name__)


def extract_keywords(text: str, min_length: int = 3) -> List[str]:
    """
    Extract meaningful keywords from case text.
    
    Args:
        text: Input case text
        min_length: Minimum length for keywords (default: 3)
    
    Returns:
        List of cleaned keywords
    """
    # Convert to lowercase and split
    words = text.lower().split()
    
    # Common stop words to filter out
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these',
        'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your'
    }
    
    # Clean and filter keywords
    keywords = []
    for word in words:
        # Remove punctuation
        cleaned = re.sub(r'[^\w\s]', '', word)
        # Keep words that are long enough and not stop words
        if len(cleaned) >= min_length and cleaned not in stop_words:
            keywords.append(cleaned)
    
    return keywords


def retrieve_sections(case_text: str, limit: int = 5) -> str:
    """
    Retrieve relevant law sections based on case text using keyword matching.
    
    Args:
        case_text: The legal case description
        limit: Maximum number of sections to retrieve (default: 5)
    
    Returns:
        Formatted string of relevant law sections or "No relevant sections found."
    """
    try:
        # Extract keywords from case text
        keywords = extract_keywords(case_text)
        
        if not keywords:
            logger.warning("No valid keywords extracted from case text")
            return "No relevant sections found."
        
        logger.info(f"Searching with {len(keywords)} keywords")
        
        # Query MongoDB for matching sections
        results = law_sections_collection.find(
            {"keywords": {"$in": keywords}},
            {"_id": 0, "section": 1, "description": 1, "act": 1}
        ).limit(limit)
        
        # Format results
        sections = []
        for idx, result in enumerate(results, 1):
            section_name = result.get('section', 'Unknown Section')
            description = result.get('description', 'No description available')
            act = result.get('act', '')
            
            # Format: "1. Section 73 (Indian Contract Act) - Compensation for loss..."
            formatted = f"{idx}. {section_name}"
            if act:
                formatted += f" ({act})"
            formatted += f" - {description}"
            
            sections.append(formatted)
        
        if not sections:
            logger.info("No matching sections found in database")
            return "No relevant sections found."
        
        logger.info(f"Retrieved {len(sections)} relevant sections")
        return "\n\n".join(sections)
        
    except Exception as e:
        logger.error(f"Error retrieving sections: {e}")
        return "No relevant sections found."


def get_section_count() -> int:
    """
    Get the total number of law sections in the database.
    
    Returns:
        Count of sections in database
    """
    try:
        return law_sections_collection.count_documents({})
    except Exception as e:
        logger.error(f"Error counting sections: {e}")
        return 0
