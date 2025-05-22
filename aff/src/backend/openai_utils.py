# backend/openai_utils.py

import os
import openai
import streamlit as st
import requests
import io
import matplotlib.pyplot as plt
import numpy as np
import asyncio
import concurrent.futures
# Centraliserad konfiguration (laddar .env)
import config

# Sätt API-nyckeln från central konfiguration
openai.api_key = config.OPENAI_API_KEY

# Om nyckeln saknas – stoppa appen tidigt
if not openai.api_key:
    st.error("OpenAI API-nyckel saknas! Lägg till den i .env eller st.secrets.")

def generate_chat_response(messages, model=None, temperature=0.7, max_tokens=1000):
    """
    Anropar OpenAI ChatCompletion och returnerar ChatGPT:s svar som en sträng.
    """
    if model is None:
        model = config.MODEL
    try:
        # Sätt timeouts för att hantera långsamma API-svar
        client = openai.OpenAI(timeout=60.0)
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    except Exception as e:
        st.error(f"Ett fel uppstod i GPT-anropet: {e}")
        return f"Kunde inte generera svar p.g.a. fel: {e}"

@st.cache_data(ttl=3600, show_spinner=False)
def generate_chatgpt_response(prompt, history=None, temperature=0.7):
    """
    Anropar OpenAI ChatCompletion och returnerar ChatGPT:s svar som en sträng.
    Med cachning för att förbättra laddningstider.
    """
    if history is None:
        history = []
    
    messages = [
        {"role": "system", "content": "Du är en futuristisk företagsrådgivare som pratar svenska. Du är hjälpsam, kreativ och ger specifika, relevanta och personliga råd baserat på användarens situation. Använd aktuella affärstrender och exempel på framgångsrika företag när det är relevant."}
    ]
    
    # Lägg till konversationshistorik
    messages.extend(history)
    
    # Lägg till aktuell fråga
    messages.append({"role": "user", "content": prompt})
    
    return generate_chat_response(messages, temperature=temperature)

def search_web(query):
    """
    Söker på webben efter relevant information
    """
    try:
        search_term = f"{query} site:.se"
        url = f"https://api.duckduckgo.com/?q={search_term}&format=json"
        response = requests.get(url, timeout=15)
        if response.status_code == 200:
            return response.json()
        else:
            return {"Error": "Kunde inte hämta sökresultat"}
    except Exception as e:
        return {"Error": str(e)}

def generate_logo(business_name, business_type):
    """Genererar en logotyp baserat på företagsnamn och typ"""
    try:
        prompt = f"Skapa en minimalistisk, modern logotyp för ett företag som heter '{business_name}' som säljer {business_type}. Använd enkla former och max 3 färger. Gör den i vektorstil med transparent bakgrund. Logotypen ska vara professionell och lätt att känna igen."
        
        # Returvärde som exempel (i verkligheten skulle detta anropa DALL-E API)
        # I den faktiska implementationen skulle vi använda:
        # response = openai.Image.create(
        #     prompt=prompt,
        #     n=1,
        #     size="512x512"
        # )
        # return response['data'][0]['url']
        
        return "https://placehold.co/512x512/blue/white?text=" + business_name.replace(" ", "+")
    except Exception as e:
        return f"Kunde inte generera logotyp: {str(e)}"

@st.cache_data(ttl=3600, show_spinner=False)
def generate_swot_analysis(data):
    """Genererar en SWOT-analys baserat på affärsdata"""
    prompt = f"""
    Gör en detaljerad SWOT-analys för ett företag som säljer {data.get('produktutbud', 'produkter')} 
    i {data.get('stad', 'en stad')} med målgruppen {data.get('malgrupp', 'konsumenter')} 
    och en {data.get('strategi', 'ospecificerad')}-strategi.
    
    Ge minst 5 punkter för varje kategori:
    1. Styrkor (Strengths)
    2. Svagheter (Weaknesses)
    3. Möjligheter (Opportunities)
    4. Hot (Threats)
    
    Basera analysen på konkret marknadsinformation och branschinsikter.
    """
    
    swot_text = generate_chatgpt_response(prompt)
    return swot_text

@st.cache_data(ttl=3600, show_spinner=False)
def create_swot_diagram(swot_text):
    """Skapar en visuell SWOT-diagram från text med optimerad minneshantering"""
    # Extrahera sektioner från SWOT-texten
    sections = {}
    current_section = None
    current_content = []
    
    for line in swot_text.split('\n'):
        line = line.strip()
        if not line:
            continue
            
        if any(keyword in line.lower() for keyword in ['styrkor', 'strength']):
            current_section = 'Styrkor'
            current_content = []
        elif any(keyword in line.lower() for keyword in ['svagheter', 'weakness']):
            if current_section and current_content:
                sections[current_section] = current_content
            current_section = 'Svagheter'
            current_content = []
        elif any(keyword in line.lower() for keyword in ['möjligheter', 'opportunit']):
            if current_section and current_content:
                sections[current_section] = current_content
            current_section = 'Möjligheter'
            current_content = []
        elif any(keyword in line.lower() for keyword in ['hot', 'threat']):
            if current_section and current_content:
                sections[current_section] = current_content
            current_section = 'Hot'
            current_content = []
        elif current_section and line.startswith(('•', '-', '*', '1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.')):
            # Rensa bort punktlistetecken
            item = line.lstrip('•-*123456789. ')
            current_content.append(item)
    
    # Lägg till den sista sektionen
    if current_section and current_content:
        sections[current_section] = current_content
    
    # Använd en mindre figurstorlek för bättre minnes- och prestanda-hantering
    plt.close('all')  # Stäng alla öppna figurer för att frigöra minne
    fig, axs = plt.subplots(2, 2, figsize=(10, 8), dpi=100)
    fig.patch.set_facecolor('#f0f0f0')
    
    # Definiera färger för varje sektion
    colors = {
        'Styrkor': '#4CAF50',      # Grön
        'Svagheter': '#F44336',    # Röd
        'Möjligheter': '#2196F3',  # Blå
        'Hot': '#FF9800'           # Orange
    }
    
    # Titlar och innehåll för varje kvadrant
    sections_order = ['Styrkor', 'Svagheter', 'Möjligheter', 'Hot']
    positions = [(0, 0), (0, 1), (1, 0), (1, 1)]
    
    for (section, pos) in zip(sections_order, positions):
        i, j = pos
        ax = axs[i, j]
        
        # Sätt bakgrundsfärg
        ax.set_facecolor(colors.get(section, '#EEEEEE') + '22')  # Lägg till transparens
        
        # Sätt titel
        ax.set_title(section, fontsize=14, fontweight='bold', color=colors.get(section, '#333333'))
        
        # Lägg till innehåll
        content = sections.get(section, ['Ingen information tillgänglig'])
        y_pos = 0.9
        for item in content[:5]:  # Begränsa till max 5 punkter för bättre läsbarhet och prestanda
            if len(item) > 55:
                item = item[:52] + '...'  # Begränsa textlängd för visning och prestanda
            ax.text(0.1, y_pos, f"• {item}", fontsize=9, va='top', wrap=True)
            y_pos -= 0.15
        
        # Ta bort axlar
        ax.set_xticks([])
        ax.set_yticks([])
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_visible(False)
        ax.spines['left'].set_visible(False)
    
    plt.tight_layout()
    
    # Spara figuren till en buffer med begränsad upplösning för bättre prestanda
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=120, bbox_inches='tight')
    buf.seek(0)
    plt.close(fig)  # Stäng figuren omedelbart för att frigöra minne
    
    return buf

@st.cache_data(ttl=3600, show_spinner=False)
def generate_company_manifest(data):
    """Genererar ett företagsmanifest med parallell bearbetning för bättre prestanda"""
    prompt = f"""
    Skapa ett inspirerande och kraftfullt företagsmanifest för ett företag som säljer {data.get('produktutbud', 'produkter')} 
    med fokus på {data.get('malgrupp', 'kunder')} och en {data.get('strategi', 'ospecificerad')}-strategi.
    
    Manifestet ska inkludera:
    1. En inspirerande vision
    2. 3-5 kärnvärderingar med korta förklaringar
    3. Ett löfte till kunderna
    4. En kort beskrivning av företagets syfte och betydelse
    
    Skriv i en inspirerande, kraftfull ton som förmedlar företagets passion och ambition. 
    Manifestet ska vara omkring 250-300 ord långt.
    """
    
    # Skapa en executor för att köra anropet i en separat tråd
    # Detta förhindrar att UI:t blockeras medan vi väntar på svaret
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future = executor.submit(generate_chatgpt_response, prompt)
        # Visa en spinner medan vi väntar
        with st.spinner("Genererar företagsmanifest..."):
            manifest = future.result()
    
    return manifest

# Asynkrona hjälpfunktioner för framtida användning
async def async_generate_chat_response(messages, model=None, temperature=0.7, max_tokens=1000):
    """Asynkron version av generate_chat_response för förbättrad responsivitet"""
    if model is None:
        model = config.MODEL
    try:
        # Skapa en klient med timeouts
        client = openai.AsyncOpenAI(timeout=60.0)
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    except Exception as e:
        st.error(f"Ett fel uppstod i asynkront GPT-anrop: {e}")
        return f"Kunde inte generera svar p.g.a. fel: {e}"

# Hjälpfunktion för att köra asynkrona anrop från synkron kod
def run_async(async_func, *args, **kwargs):
    """Kör en asynkron funktion från synkron kod"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(async_func(*args, **kwargs))
    finally:
        loop.close()
