# Konfigurera miljövariabler för applikationen
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

# Skapa logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Flagga för att undvika dubbla laddningar
_ENV_ALREADY_LOADED = 'OPENAI_ENV_LOADED' in os.environ

def load_environment_variables():
    """Ladda miljövariabler från .env-filen med sökvägshantering"""
    global _ENV_ALREADY_LOADED
    
    # Kontrollera om miljövariablerna redan har laddats (för att undvika dubbla starter)
    if _ENV_ALREADY_LOADED:
        logger.info("Miljövariablerna har redan laddats, hoppar över")
        return True
    
    # Försök hitta .env-filen på flera möjliga platser
    potential_paths = [
        Path(".") / ".env",
        Path("./src") / ".env", 
        Path("..") / ".env",
        Path(__file__).parent / ".env",
        Path(__file__).parent.parent / ".env",
    ]
    
    env_loaded = False
    for path in potential_paths:
        if path.exists():
            logger.info(f"Laddar miljövariabler från {path}")
            env_loaded = load_dotenv(dotenv_path=path, override=True)
            if env_loaded:
                break
    
    if not env_loaded:
        logger.warning("Ingen .env-fil hittades. Använder befintliga miljövariabler om tillgängliga.")
    
    # Markera att miljövariablerna har laddats för att undvika dubbla starter
    os.environ['OPENAI_ENV_LOADED'] = 'true'
    _ENV_ALREADY_LOADED = True
    
    return env_loaded

# Ladda miljövariabler bara om de inte redan har laddats
if not _ENV_ALREADY_LOADED:
    load_environment_variables()

# Hämta API-nyckel och modell från miljövariabler
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Kontrollera och hantera saknad API-nyckel
if not OPENAI_API_KEY or OPENAI_API_KEY.strip() == "":
    logger.warning("OpenAI API-nyckel saknas eller är tom!")
    # Sätt en dummy-nyckel för att undvika krasch
    OPENAI_API_KEY = "sk-dummy-key-for-testing-only"
    logger.warning("En dummy-nyckel har satts, men API-funktioner kommer inte att fungera.")
    
    # Sätt en flagga för att indikera att nyckeln saknas
    os.environ["OPENAI_API_KEY_MISSING"] = "true"
else:
    logger.info("OpenAI API-nyckel hittad")
    # Ta bort flaggan om den finns
    if "OPENAI_API_KEY_MISSING" in os.environ:
        del os.environ["OPENAI_API_KEY_MISSING"]

# Ladda modellnamn med standardvärde
MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
logger.info(f"Använder OpenAI-modell: {MODEL}")

# Exportera funktioner för användning utifrån
__all__ = ["OPENAI_API_KEY", "MODEL", "load_environment_variables"]