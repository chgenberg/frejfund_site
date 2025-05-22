#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Startskript för Affärsplan-appen
Kör detta skript för att starta appen med ett klick.

Detta skript har delats upp i flera moduler för bättre 
struktur och enklare underhåll:

- utils/colors.py: Färghantering och utskriftsfunktioner
- utils/env_manager.py: Hantering av miljövariabler
- utils/app_launcher.py: Start och övervakning av appen
"""

import os
import sys
from utils.colors import print_header, Colors
from utils.env_manager import check_installation, load_env_variables
from utils.app_launcher import start_app

# Lägg till denna katalog och överordnad i PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, current_dir)
sys.path.insert(0, parent_dir)

def main():
    """Huvudfunktion som kör startsekvensen"""
    # Gå till rätt mapp (src)
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print_header()
    
    # Kör alla stegen i sekvens
    if check_installation() and load_env_variables():
        start_app()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.BLUE}👋 Avslutar...{Colors.END}")
        sys.exit(0) 