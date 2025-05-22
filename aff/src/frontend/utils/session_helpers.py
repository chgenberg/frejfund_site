# frontend/utils/session_helpers.py

import streamlit as st
from backend.session_utils import save_progress, load_progress

def reset_session():
    """Återställer sessionen till ursprungsläget"""
    st.session_state.user_data = {}
    st.session_state.conversation_history = []
    st.session_state.current_stage = 'intro'
    st.session_state.pdf_path = None
    st.session_state.swot_analysis = None
    st.session_state.swot_image = None
    st.session_state.manifest = None
    st.session_state.logo_url = None

def get_current_stage_name():
    """Konverterar det tekniska stegnamnet till ett användarvänligt namn"""
    stage_map = {
        "intro": "Introduktion",
        "basic_info": "Grundläggande information",
        "deep_dive": "Fördjupad analys",
        "financial": "Ekonomisk planering",
        "business_plan": "Affärsplan"
    }
    return stage_map.get(st.session_state.current_stage, "Okänt steg")

def determine_stage_from_data(user_data):
    """Bestämmer lämpligt steg baserat på data som laddats"""
    if 'affarsplan' in user_data:
        return 'business_plan'
    elif user_data.get('konkurrenter') or user_data.get('foretagsnamn'):
        return 'deep_dive'
    elif user_data.get('stad') and user_data.get('produktutbud'):
        return 'basic_info'
    else:
        return 'intro' 