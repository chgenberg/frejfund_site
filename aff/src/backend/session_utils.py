# backend/session_utils.py

import json
import os
from datetime import datetime
import logging

# Skapa enkel loggning
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def save_progress(user_data, conversation_history):
    """
    Sparar användardata och konversationshistorik till en fil
    
    Args:
        user_data (dict): Användarens data och svar
        conversation_history (list): Historiken över konversationen
        
    Returns:
        str: Filnamnet som skapades
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"affarsplan_{timestamp}.json"
    
    data = {
        "user_data": user_data,
        "conversation_history": conversation_history,
        "timestamp": timestamp
    }
    
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        logger.info(f"Framgångsrikt sparat data till {filename}")
        return filename
    except IOError as e:
        logger.error(f"Kunde inte spara till fil {filename}: {e}")
        return None
    except Exception as e:
        logger.error(f"Oväntat fel vid sparande av data: {e}")
        return None

def load_progress(filename):
    """
    Laddar användardata och konversationshistorik från en fil
    
    Args:
        filename (str): Sökvägen till filen som ska laddas
        
    Returns:
        tuple: (user_data, conversation_history)
    """
    if not os.path.exists(filename):
        logger.warning(f"Filen {filename} hittades inte")
        return {}, []
        
    try:
        with open(filename, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        logger.info(f"Framgångsrikt laddat data från {filename}")
        return data.get("user_data", {}), data.get("conversation_history", [])
    except json.JSONDecodeError as e:
        logger.error(f"Ogiltig JSON i filen {filename}: {e}")
        return {}, []
    except IOError as e:
        logger.error(f"Kunde inte läsa filen {filename}: {e}")
        return {}, []
    except Exception as e:
        logger.error(f"Oväntat fel vid laddning av data: {e}")
        return {}, [] 