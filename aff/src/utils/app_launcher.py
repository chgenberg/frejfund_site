# src/utils/app_launcher.py
"""
Funktioner för att starta Streamlit-appen.
"""

import os
import sys
import time
import webbrowser
import subprocess
from utils.colors import print_info, print_success, print_warning, print_error, Colors

def find_app_path():
    """
    Lokaliserar app.py i filsystemet och byter till rätt katalog.
    
    Returns:
        bool: True om app.py hittades, annars False
    """
    if os.path.exists("app.py"):
        print_success(f"app.py hittad i: {os.getcwd()}")
        return True
    
    print_warning(f"Kunde inte hitta app.py i aktuell katalog: {os.getcwd()}")
    
    # Kolla om vi är i src-mappen
    if os.path.exists("../app.py"):
        print_warning("app.py hittades i överliggande katalog. Ändrar katalog.")
        os.chdir("..")
        return True
    elif os.path.exists("src/app.py"):
        print_warning("app.py hittades i src-mappen. Ändrar katalog.")
        os.chdir("src")
        return True
    else:
        # Gör en mer omfattande sökning
        potential_paths = []
        for root, dirs, files in os.walk(".", topdown=True):
            if "app.py" in files:
                potential_paths.append(os.path.join(root, "app.py"))
        
        if potential_paths:
            app_path = potential_paths[0]
            app_dir = os.path.dirname(app_path)
            print_warning(f"app.py hittades på annan plats: {app_path}. Ändrar katalog.")
            if app_dir:
                os.chdir(app_dir)
            else:
                # app.py finns i nuvarande katalog men kunde inte hittas - kan vara ett rättighetsproblem
                print_error("Kunde inte få åtkomst till app.py.")
                return False
            return True
        else:
            print_error("Kunde inte hitta app.py någonstans. Kontrollera installationen.")
            return False

def check_streamlit_running():
    """
    Kontrollerar om Streamlit redan kör på port 8501.
    
    Returns:
        bool: True om Streamlit redan kör, annars False
    """
    try:
        # Använd netstat för att kontrollera om port 8501 (Streamlit standardport) redan är i användning
        if sys.platform == "win32":
            netstat_cmd = "netstat -ano | findstr :8501"
            result = subprocess.run(netstat_cmd, shell=True, text=True, capture_output=True)
            if "LISTENING" in result.stdout:
                print_warning("Streamlit verkar redan köra på port 8501.")
                print_warning("   Öppnar webbläsaren till befintlig instans...")
                webbrowser.open("http://localhost:8501")
                return True
        else:
            # För Linux/Mac
            netstat_cmd = "lsof -i:8501"
            result = subprocess.run(netstat_cmd, shell=True, text=True, capture_output=True)
            if "streamlit" in result.stdout:
                print_warning("Streamlit verkar redan köra på port 8501.")
                print_warning("   Öppnar webbläsaren till befintlig instans...")
                webbrowser.open("http://localhost:8501")
                return True
        return False
    except Exception as e:
        # Om det inte går att kontrollera, fortsätt ändå
        print_warning(f"Kunde inte kontrollera om Streamlit redan kör: {e}")
        return False

def verify_streamlit_installation():
    """
    Verifierar att Streamlit är installerat och fungerar.
    
    Returns:
        bool: True om verifieringen lyckades, annars False
    """
    try:
        streamlit_version = subprocess.check_output([sys.executable, "-m", "streamlit", "--version"], text=True)
        print_success(f"Streamlit installerat: {streamlit_version.strip()}")
        return True
    except Exception as e:
        print_error(f"Kunde inte bekräfta Streamlit-installation: {e}. Fortsätter ändå...")
        return False

def is_process_running(process):
    """
    Kontrollerar om en process fortfarande körs.
    
    Args:
        process: Process-objektet att kontrollera
        
    Returns:
        bool: True om processen körs, annars False
    """
    return process.poll() is None

def monitor_startup(process, timeout=15):
    """
    Övervakar startprocessen och söker efter URL eller felmeddelanden.
    
    Args:
        process: Process-objektet som kör Streamlit
        timeout (int): Maximal väntetid i sekunder
        
    Returns:
        bool: True om appen startade framgångsrikt, annars False
    """
    # En flagga för att hålla reda på om URL hittades
    url_found = False
    start_time = time.time()
    
    print_info("Väntar på att Streamlit ska starta...")
    
    # Vänta på att Streamlit ska starta och skriva ut URL
    while is_process_running(process) and time.time() - start_time < timeout:
        # Läs från stdout
        stdout_line = process.stdout.readline()
        if stdout_line:
            if "Local URL" in stdout_line:
                url = stdout_line.split("Local URL: ")[1].strip()
                print_success("Appen startad framgångsrikt!")
                print_success(f"🌐 Öppnar webbläsaren på: {url}")
                time.sleep(1)  # Kort paus för att säkerställa att servern är redo
                webbrowser.open(url)
                url_found = True
                break
        
        # Läs från stderr
        stderr_line = process.stderr.readline()
        if stderr_line:
            if "Error" in stderr_line or "Exception" in stderr_line:
                print_error(f"Fel vid start av Streamlit: {stderr_line.strip()}")
        
        time.sleep(0.1)
    
    # Kontrollera resultatet
    if not is_process_running(process):
        returncode = process.poll()
        print_error(f"Streamlit avslutades oväntat med kod {returncode}.")
        # Försök få felmeddelanden
        output, errors = process.communicate()
        if errors:
            print_error(f"Fel:\n{errors}")
        return False
    
    if not url_found:
        print_warning("Appen startade, men kunde inte automatiskt identifiera URL:en.")
        print_warning("   Försök öppna http://localhost:8501 manuellt.")
        
        # Försök ändå öppna standardadressen efter en kort paus
        time.sleep(2)
        webbrowser.open("http://localhost:8501")
    
    return True

def stop_application(process):
    """
    Stoppar Streamlit-processen på ett kontrollerat sätt.
    
    Args:
        process: Process-objektet att stoppa
    """
    if is_process_running(process):
        try:
            process.terminate()
            process.wait(timeout=5)  # Vänta på avslut med timeout
            print_success("Appen avslutad.")
        except subprocess.TimeoutExpired:
            print_warning("Kunde inte avsluta Streamlit snyggt. Tvångsavslutar.")
            process.kill()
            print_success("Appen avslutad (forcerat).")

def monitor_application(process):
    """
    Övervakar Streamlit-processen och fångar upp fel och avslutssignaler.
    
    Args:
        process: Process-objektet att övervaka
    """
    print_info("Tryck Ctrl+C för att avsluta appen")
    
    # Fortsätt läsa utdata för att undvika att processen "hänger"
    while is_process_running(process):
        try:
            # Polling istället för att blockera
            stdout_line = process.stdout.readline()
            if stdout_line and "error" in stdout_line.lower():
                print_error(f"Streamlit: {stdout_line.strip()}")
                
            stderr_line = process.stderr.readline()
            if stderr_line and "error" in stderr_line.lower():
                print_error(f"Streamlit Error: {stderr_line.strip()}")
                
            time.sleep(0.1)
        except KeyboardInterrupt:
            print(f"\n{Colors.YELLOW}⚠️ Avslutar Streamlit-appen...{Colors.END}")
            break
    
    # Avsluta appen om den fortfarande kör
    stop_application(process)

def start_app():
    """
    Huvudfunktion för att starta Streamlit-appen.
    
    Returns:
        bool: True om appen startade framgångsrikt, annars False
    """
    try:
        print_info("Startar Affärsplan-appen...")
        
        # 1. Hitta app.py
        if not find_app_path():
            return False
        
        # 2. Verifiera Streamlit-installation
        verify_streamlit_installation()
        
        # 3. Markera att miljövariablerna har laddats
        os.environ['OPENAI_ENV_LOADED'] = 'true'
        
        # 4. Kontrollera om Streamlit redan kör
        if check_streamlit_running():
            return True
        
        # 5. Starta appen med förbättrade inställningar
        cmd = [
            sys.executable, 
            "-m", 
            "streamlit", 
            "run", 
            "app.py", 
            "--server.headless", "true",
            "--server.enableCORS", "false",
            "--server.enableXsrfProtection", "true",
            "--browser.gatherUsageStats", "false"
        ]
        
        print_info(f"Kör kommando: {' '.join(cmd)}")
        
        process = subprocess.Popen(
            cmd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,  # Buffra rad för rad
            universal_newlines=True
        )
        
        # 6. Övervaka uppstart
        if not monitor_startup(process):
            return False
        
        # 7. Övervaka körning
        monitor_application(process)
        
        return True
        
    except Exception as e:
        print_error(f"Fel vid start av appen: {str(e)}")
        print_warning("Försök starta manuellt: streamlit run app.py")
        return False 