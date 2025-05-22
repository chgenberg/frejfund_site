# src/utils/colors.py
"""
Färghantering och utskriftsfunktioner för terminalen.
"""

class Colors:
    """ANSI-färgkoder för snyggare utskrift i terminalen"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header():
    """Visar en snygg header för Affärsplan-appen"""
    print(f"{Colors.HEADER}{Colors.BOLD}")
    print("╔══════════════════════════════════════════════════════╗")
    print("║                                                      ║")
    print("║  🚀 Affärsplan - Interaktiv Affärsrådgivare         ║")
    print("║                                                      ║")
    print("╚══════════════════════════════════════════════════════╝")
    print(f"{Colors.END}")

def print_info(message):
    """Skriver ut informationsmeddelande i blått"""
    print(f"{Colors.BLUE}ℹ️ {message}{Colors.END}")

def print_success(message):
    """Skriver ut lyckad-meddelande i grönt"""
    print(f"{Colors.GREEN}✅ {message}{Colors.END}")

def print_warning(message):
    """Skriver ut varningsmeddelande i gult"""
    print(f"{Colors.YELLOW}⚠️ {message}{Colors.END}")

def print_error(message):
    """Skriver ut felmeddelande i rött"""
    print(f"{Colors.RED}❌ {message}{Colors.END}") 