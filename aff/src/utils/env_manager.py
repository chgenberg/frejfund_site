# src/utils/env_manager.py
"""
Hantering av miljövariabler och .env-filer.
"""

import os
import sys
import subprocess
from pathlib import Path
import importlib.util

from utils.colors import print_error, print_warning, print_success, print_info, Colors

def check_installation():
    """
    Kontrollerar att alla nödvändiga paket är installerade.
    
    Returns:
        bool: True om alla paket är installerade, annars False
    """
    streamlit_available = importlib.util.find_spec("streamlit") is not None
    dotenv_available = importlib.util.find_spec("dotenv") is not None
    
    if streamlit_available and dotenv_available:
        return True
    else:
        missing = []
        if not streamlit_available:
            missing.append("streamlit")
        if not dotenv_available:
            missing.append("python-dotenv")
            
        print_error(f"Saknar nödvändiga paket: {', '.join(missing)}")
        print_warning("Försöker installera nödvändiga paket...")
        
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
            return True
        except subprocess.CalledProcessError:
            print_error("Kunde inte installera nödvändiga paket.")
            print_warning("Kör manuellt: pip install -r requirements.txt")
            return False

def create_env_file(env_path):
    """
    Skapar en ny .env-fil på angiven sökväg.
    
    Args:
        env_path (Path): Sökväg där .env-filen ska skapas
    """
    print_warning("Ingen .env-fil hittad. Skapar en tom fil.")
    with open(env_path, "w") as f:
        f.write("# Lägg din OpenAI API-nyckel här\n")
        f.write("OPENAI_API_KEY=\n")
        f.write("# OpenAI-modell (om du vill ändra från standardvärdet)\n")
        f.write("OPENAI_MODEL=gpt-4o\n")
    
    print_warning("📝 Öppna .env-filen och lägg till din OpenAI API-nyckel")
    print_warning("   format: OPENAI_API_KEY=sk-...")
    
    # Öppna .env-filen för redigering om möjligt
    try:
        if sys.platform == "win32":
            os.startfile(env_path)
        elif sys.platform == "darwin":  # macOS
            subprocess.call(["open", str(env_path)])
        else:  # Linux
            subprocess.call(["xdg-open", str(env_path)])
    except Exception as e:
        print_warning(f"Kunde inte öppna .env-filen automatiskt: {e}")
        print_warning(f"Vänligen öppna filen manuellt på: {env_path.absolute()}")
    
    input(f"{Colors.YELLOW}Tryck Enter när du har lagt till din API-nyckel...{Colors.END}")

def update_api_key(env_path, api_key):
    """
    Uppdaterar API-nyckeln i .env-filen.
    
    Args:
        env_path (Path): Sökväg till .env-filen
        api_key (str): API-nyckeln som ska läggas till
    """
    env_content = ""
    try:
        with open(env_path, "r") as f:
            env_content = f.read()
    except Exception as e:
        print_warning(f"Kunde inte läsa .env-filen: {e}")
    
    if "OPENAI_API_KEY=" in env_content:
        # Ersätt befintlig nyckel
        env_content = env_content.replace(
            "OPENAI_API_KEY=", 
            f"OPENAI_API_KEY={api_key}"
        )
    else:
        # Lägg till ny nyckel
        env_content += f"\nOPENAI_API_KEY={api_key}\n"
    
    with open(env_path, "w") as f:
        f.write(env_content)
    
    # Uppdatera miljövariabeln
    os.environ["OPENAI_API_KEY"] = api_key
    
    print_success("API-nyckel sparad.")

def load_env_variables():
    """
    Laddar miljövariabler från .env-filen.
    
    Returns:
        bool: True om miljövariablerna laddades framgångsrikt, annars False
    """
    try:
        # Kontrollera om python-dotenv är tillgänglig
        if importlib.util.find_spec("dotenv") is None:
            print_error("python-dotenv är inte installerat.")
            return False
        
        from dotenv import load_dotenv
        
        # Identifiera alla möjliga platser för .env-filen
        potential_paths = [
            Path(".") / ".env",
            Path("./src") / ".env",
            Path("..") / ".env"
        ]
        
        env_path = None
        for path in potential_paths:
            if path.exists():
                env_path = path
                print_success(f"Hittade .env-fil på {path}")
                break
        
        # Skapa .env-fil om den inte finns
        if not env_path:
            env_path = Path(".") / ".env"
            create_env_file(env_path)
        
        # Ladda .env-filen
        loaded = load_dotenv(dotenv_path=env_path)
        if not loaded:
            print_warning(".env-filen laddades inte korrekt.")
        
        # Kontrollera att API-nyckeln finns
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key or api_key.strip() == "":
            print_error("Ingen OpenAI API-nyckel hittad i .env-filen.")
            print_warning("Vänligen ange din OpenAI API-nyckel:")
            api_key = input("> ")
            
            if not api_key.strip():
                print_error("Ingen API-nyckel angiven. Delar av appen kommer inte att fungera.")
                print_warning("Du kan fortsätta utan API-nyckel, men funktionaliteten kommer att vara begränsad.")
                # Sätt en tillfällig nyckel för att undvika krasch (kommer inte att fungera för API-anrop)
                os.environ["OPENAI_API_KEY"] = "sk-dummy-key-for-testing-only"
                print_warning("En dummy-nyckel har satts för att undvika krasch. API-funktioner kommer inte att fungera.")
            else:
                update_api_key(env_path, api_key)
        
        # Kontrollera om modellnamnet finns, annars använd standard
        if not os.environ.get("OPENAI_MODEL"):
            print_warning("Ingen modell angiven, använder gpt-4o som standard.")
            os.environ["OPENAI_MODEL"] = "gpt-4o"
        
        return True
    except Exception as e:
        print_error(f"Fel vid laddning av miljövariabler: {str(e)}")
        return False 