# backend/pdf_utils.py

import tempfile
import os
import base64
from fpdf import FPDF
from datetime import datetime
import requests
import uuid
import io
from PIL import Image
import streamlit as st

@st.cache_data(ttl=3600)
def create_pdf_report(data, swot_text=None, swot_image=None, manifest=None, logo_url=None):
    """Skapar en PDF-rapport med all affärsplansinformation"""
    pdf = FPDF()
    # Sätt UTF-8 som kodning för att hantera specialtecken
    pdf.add_page()
    
    # Sätt typsnitt
    pdf.set_font("Arial", "B", 24)
    
    # Titelrubrik
    company_name = data.get('foretagsnamn', f"{data.get('produktutbud', 'Företag')} i {data.get('stad', 'Sverige')}")
    # Konvertera eventuella problematiska tecken
    company_name = company_name.encode('latin-1', 'replace').decode('latin-1')
    pdf.cell(190, 20, f"Affärsplan: {company_name}", ln=True, align="C")
    
    # Logotyp om tillgänglig
    if logo_url:
        try:
            # Ladda ner logotypbild med timeout
            response = requests.get(logo_url, timeout=10)
            if response.status_code == 200:
                # Använd temporär fil med context manager för att säkerställa rensning
                with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
                    temp_file.write(response.content)
                    temp_path = temp_file.name
                
                try:
                    # Använd PIL för att optimera bilden före infogning
                    with Image.open(temp_path) as img:
                        # Kontrollera att bilden inte är för stor
                        if img.width > 300 or img.height > 300:
                            img.thumbnail((300, 300))
                        img.save(temp_path, optimize=True)
                    
                    # Lägg till logotypen i PDF
                    pdf.image(temp_path, x=80, y=30, w=50)
                    pdf.ln(60)  # Lägg till utrymme efter logotypen
                except Exception as e:
                    # Logga felet men fortsätt processen
                    print(f"Fel vid bildbehandling: {e}")
                finally:
                    # Rensa temporära filer oavsett om det var framgångsrikt eller inte
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                    
        except Exception as e:
            print(f"Kunde inte lägga till logotyp: {e}")
    
    # Grundläggande information
    pdf.set_font("Arial", "B", 16)
    pdf.cell(190, 10, "Grundläggande information", ln=True)
    pdf.ln(5)
    
    # Tabellformat för grundläggande information
    pdf.set_font("Arial", "", 12)
    info_items = [
        ("Stad", data.get('stad', 'N/A')),
        ("Målgrupp", data.get('malgrupp', 'N/A')),
        ("Produktutbud", data.get('produktutbud', 'N/A')),
        ("Strategi", data.get('strategi', 'N/A')),
        ("Tidsplan", data.get('tidsplan', 'N/A')),
        ("Budget", data.get('budget', 'N/A'))
    ]
    
    for label, value in info_items:
        pdf.set_font("Arial", "B", 12)
        pdf.cell(40, 10, label + ":", 0)
        pdf.set_font("Arial", "", 12)
        # Konvertera eventuella problematiska tecken
        value = str(value).encode('latin-1', 'replace').decode('latin-1')
        pdf.cell(150, 10, value, ln=True)
    
    pdf.ln(10)
    
    # Affärsplan
    if 'affarsplan' in data:
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(190, 10, "Affärsplan", ln=True)
        pdf.ln(5)
        
        pdf.set_font("Arial", "", 12)
        
        # Dela upp texten i stycken och lägg till i PDF
        plan_text = data.get('affarsplan', '')
        # Konvertera eventuella problematiska tecken
        plan_text = plan_text.encode('latin-1', 'replace').decode('latin-1')
        paragraphs = plan_text.split('\n\n')
        
        for paragraph in paragraphs:
            # Kolla om det är en rubrik (antar att rubriker är korta rader som slutar med kolon)
            if len(paragraph) < 50 and paragraph.strip().endswith(':'):
                pdf.set_font("Arial", "B", 14)
                pdf.cell(190, 10, paragraph, ln=True)
                pdf.set_font("Arial", "", 12)
            else:
                pdf.multi_cell(190, 10, paragraph)
                pdf.ln(5)
    
    # SWOT-analys
    if swot_text:
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(190, 10, "SWOT-analys", ln=True)
        pdf.ln(5)
        
        # Om det finns en bild av SWOT-diagrammet
        if swot_image:
            try:
                # Använd temporär fil med context manager för SWOT-bilden
                with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as temp_file:
                    temp_file.write(swot_image.getvalue())
                    swot_img_path = temp_file.name
                
                try:
                    # Försök lägga till bilden
                    pdf.image(swot_img_path, x=10, y=None, w=190)
                    pdf.ln(140)  # Lägg till tillräckligt med utrymme efter bilden
                except Exception as e:
                    print(f"Fel vid infogning av SWOT-bild: {e}")
                finally:
                    # Rensa temporära filer
                    if os.path.exists(swot_img_path):
                        os.remove(swot_img_path)
            except Exception as e:
                print(f"Kunde inte hantera SWOT-bild: {e}")
        
        # Detaljerad SWOT-text
        pdf.set_font("Arial", "", 12)
        # Konvertera eventuella problematiska tecken
        swot_text_safe = swot_text.encode('latin-1', 'replace').decode('latin-1')
        pdf.multi_cell(190, 10, swot_text_safe)
    
    # Företagsmanifest
    if manifest:
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        pdf.cell(190, 10, "Företagsmanifest", ln=True)
        pdf.ln(5)
        
        pdf.set_font("Arial", "I", 12)
        # Konvertera eventuella problematiska tecken
        manifest_safe = manifest.encode('latin-1', 'replace').decode('latin-1')
        pdf.multi_cell(190, 10, manifest_safe)
    
    # Lägg till datum och sidfot
    pdf.set_y(-15)
    pdf.set_font("Arial", "I", 8)
    now = datetime.now().strftime("%Y-%m-%d")
    pdf.cell(0, 10, f"Genererad {now} | {company_name} Affärsplan", 0, 0, 'C')
    
    # Använd en tydlig filnam-struktur och spara i tempkatalogen
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    temp_pdf_path = os.path.join(tempfile.gettempdir(), f"affarsplan_{timestamp}.pdf")
    pdf.output(temp_pdf_path)
    
    return temp_pdf_path

def get_pdf_download_link(file_path, text="Ladda ner PDF"):
    """Genererar en länk för att ladda ner PDF-filen"""
    with open(file_path, "rb") as f:
        pdf_bytes = f.read()
    
    b64 = base64.b64encode(pdf_bytes).decode()
    href = f'<a href="data:application/pdf;base64,{b64}" download="{os.path.basename(file_path)}">{text}</a>'
    return href

def simple_pdf_report(title, content, output_filename="rapport.pdf"):
    """
    Skapar en enkel PDF-rapport med angivet innehåll.
    content förväntas vara en sträng eller lista av strängar.
    Returnerar sökvägen till den genererade PDF-filen.
    """
    pdf = FPDF()
    pdf.add_page()
    
    # Titeln
    pdf.set_font("Arial", "B", 16)
    pdf.cell(190, 10, title, ln=True)
    pdf.ln(5)
    
    # Innehållet
    pdf.set_font("Arial", "", 12)
    
    if isinstance(content, list):
        for paragraph in content:
            pdf.multi_cell(190, 10, paragraph)
            pdf.ln(5)
    else:
        pdf.multi_cell(190, 10, content)
    
    # Spara PDF temporärt
    now = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"{output_filename.split('.')[0]}_{now}.pdf"
    pdf.output(output_path)
    
    return output_path
