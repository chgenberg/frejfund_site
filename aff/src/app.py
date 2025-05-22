# app.py

import streamlit as st
import os
import requests
from frontend.pages import (
    intro_page,
    basic_info_page,
    deep_dive_page,
    financial_page,
    business_plan_page,
    business_analysis_page
)
from frontend.components.sidebar import create_sidebar
import uuid
import io
from PIL import Image
# Centraliserad konfiguration för API-nyckel och modell
import config

# Uppdaterad CSS med förbättrad layout och eliminerad överlappning
custom_css = """
<style>
/* --- Importera typsnitt --- */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');

/* ---------- Bas ---------- */
.myapp {
    font-family: 'Inter', sans-serif;
    color: var(--text-color);
}

.myapp [data-testid="stAppViewContainer"] {
    background: linear-gradient(135deg,
                var(--background-color) 0%,
                var(--secondary-background-color) 100%);
}

/* --------- Header --------- */
.myapp [data-testid="stHeader"] {
    background: rgba(10, 10, 36, 0.95);
    border-bottom: 1px solid rgba(157,129,255,.15);
    backdrop-filter: blur(8px);
}

/* -------- Block-container (behåll responsivitet) -------- */
.myapp .block-container {
    padding: 1.5rem;        /* ingen max-width-override */
}

/* -------- Rubriker -------- */
.myapp h1, .myapp h2, .myapp h3 {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(90deg, var(--primary-color), #73c2fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 1.6rem;
}

/* -------- Sidofält -------- */
.myapp [data-testid="stSidebar"] {
    background: rgba(16,16,38,.95);
    border-right: 1px solid rgba(157,129,255,.15);
    backdrop-filter: blur(8px);
}
.myapp [data-testid="stSidebar"] .block-container {
    padding: 1rem;
}

/* -------- Form-komponenter -------- */
.myapp .stTextInput input,
.myapp .stTextArea textarea,
.myapp .stSelectbox > div,
.myapp .stMultiselect > div {
    background: rgba(32,32,64,.4);
    border: 1px solid rgba(157,129,255,.25);
    border-radius: 10px;
    padding: .6rem 1rem;
}
.myapp .stTextInput input:focus,
.myapp .stTextArea textarea:focus {
    border-color: rgba(157,129,255,.8);
    box-shadow: 0 0 0 3px rgba(157,129,255,.3);
}

/* -------- Knappar -------- */
.myapp button, .myapp .stButton>button {
    background: var(--primary-color);
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: .6rem 1.2rem;
    font-weight: 600;
    letter-spacing: .4px;
    text-transform: uppercase;
    transition: transform .2s, box-shadow .2s;
    margin: .8rem 0;
}
.myapp button:hover, .myapp .stButton>button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(157,129,255,.35);
}

/* -------- Progressbar -------- */
.myapp .stProgress > div > div > div {
    background: var(--primary-color);
    border-radius: 8px;
    height: 8px;
}

/* -------- Expander -------- */
.myapp .streamlit-expanderHeader {
    background: rgba(32,32,64,.5);
    color: var(--primary-color);
    border-left: 3px solid var(--primary-color);
    border-radius: 8px;
    padding: .7rem 1rem;
    font-weight: 500;
}
.myapp .streamlit-expanderContent {
    background: rgba(32,32,64,.25);
    border: 1px solid rgba(157,129,255,.15);
    border-top: none;
    border-radius: 0 0 8px 8px;
    padding: 1rem;
}

/* -------- Bilder -------- */
.myapp [data-testid="stImage"] img {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,.25);
    max-width: 100%;
}

/* -------- Media-queries (mobilt) -------- */
@media (max-width: 768px) {
    .myapp .block-container { padding: 1rem; }
    .myapp h1 { font-size: 1.8rem; }
    .myapp button, .myapp .stButton>button { width: 100%; }
}
</style>
"""

# Laddad via config.py (innehåller redan load_dotenv())
API_KEY = config.OPENAI_API_KEY

@st.cache_data(ttl=3600, show_spinner=False)
def generate_custom_logo(prompt):
    """
    Funktion för att generera logotyp med DALL-E API
    Cachelagrad för att undvika onödiga API-anrop och förbättra prestanda.
    """
    # Kontrollera om API-nyckeln är en dummy-nyckel eller saknas helt
    if not API_KEY or API_KEY == "sk-dummy-key-for-testing-only" or "OPENAI_API_KEY_MISSING" in os.environ:
        st.warning("OpenAI API-nyckel saknas. Vissa funktioner kommer inte att fungera.")
        return None
        
    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    
    data = {
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "standard",  # Använd standard istället för hd för snabbare svar
        "style": "vivid"
    }
    
    try:
        # Använd timeout för att undvika långa väntetider
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            image_url = response.json()['data'][0]['url']
            return image_url
        else:
            error_message = f"Fel vid API-anrop (kod {response.status_code}): {response.text}"
            st.error(error_message)
            return None
    except Exception as e:
        st.error(f"Fel vid generering av logotyp: {e}")
        return None

# Sessionhantering för att spara tidigare svar och användardata
if 'user_data' not in st.session_state:
    st.session_state.user_data = {}
if 'conversation_history' not in st.session_state:
    st.session_state.conversation_history = []
if 'current_stage' not in st.session_state:
    st.session_state.current_stage = 'intro'
if 'pdf_path' not in st.session_state:
    st.session_state.pdf_path = None
if 'swot_analysis' not in st.session_state:
    st.session_state.swot_analysis = None
if 'swot_image' not in st.session_state:
    st.session_state.swot_image = None
if 'manifest' not in st.session_state:
    st.session_state.manifest = None
if 'logo_url' not in st.session_state:
    st.session_state.logo_url = None
if 'custom_logo_mode' not in st.session_state:
    st.session_state.custom_logo_mode = False

def main():
    # 1) Injicera hela CSS-paketet först
    st.markdown(custom_css, unsafe_allow_html=True)

    # 2) Öppna wrappern – allt som skrivs efteråt hamnar i .myapp
    st.markdown('<div class="myapp">', unsafe_allow_html=True)

    # 3) Sido-meny
    create_sidebar()

    # 4) Sidnavigering
    if st.session_state.current_stage == 'intro':
        intro_page()
    elif st.session_state.current_stage == 'basic_info':
        basic_info_page()
    elif st.session_state.current_stage == 'deep_dive':
        deep_dive_page()
    elif st.session_state.current_stage == 'financial':
        financial_page()
    elif st.session_state.current_stage == 'business_plan':
        business_plan_page()
    elif st.session_state.current_stage == 'business_analysis':
        business_analysis_page()

    # 5) Stäng wrappern – MÅSTE ligga sist i main()
    st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    st.set_page_config(
        page_title="Interaktiv Affärsplan",
        page_icon="📊",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    main()