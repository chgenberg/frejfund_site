# frontend/pages/financial_page.py

import streamlit as st
from frontend.components.ui_components import progress_bar, section_title
from backend.openai_utils import generate_chatgpt_response

def financial_page():
    """Sida för ekonomisk planering av användarens affärsidé"""
    st.title("Ekonomisk planering")
    progress_bar(st.session_state.current_stage)
    
    # Visa tidigare svar
    with st.expander("Sammanfattning av dina svar hittills"):
        for key, value in st.session_state.user_data.items():
            st.write(f"**{key.capitalize()}:** {value}")
    
    # Kostnadsuppskattning
    section_title("Kostnadsuppskattning", icon="💸")
    if st.button("Generera kostnadsuppskattning", help="Få en detaljerad uppskattning av uppstartskostnader."):
        data = st.session_state.user_data
        cost_prompt = (
            f"Gör en detaljerad kostnadsuppskattning för att starta en butik för {data.get('produktutbud', 'N/A')} "
            f"i {data.get('stad', 'N/A')} med en {data.get('strategi', 'N/A')}-strategi. "
            f"Inkludera alla relevanta kostnader som hyra, inredning, personal, lager, marknadsföring, etc. "
            f"Ge kostnadsuppskattningar i svenska kronor baserat på aktuell marknadssituation."
        )
        kostnadsanalys = generate_chatgpt_response(cost_prompt)
        st.write(kostnadsanalys)
        st.session_state.conversation_history.append({"role": "user", "content": "Kostnadsuppskattning för min verksamhet"})
        st.session_state.conversation_history.append({"role": "assistant", "content": kostnadsanalys})
    
    # ROI-analys
    section_title("Return on Investment (ROI)", icon="📈")
    if st.button("Generera ROI-analys", help="Få en analys av förväntad avkastning på din investering."):
        data = st.session_state.user_data
        roi_prompt = (
            f"Gör en ROI-analys (Return on Investment) för en verksamhet som säljer {data.get('produktutbud', 'N/A')} "
            f"i {data.get('stad', 'N/A')} med en startbudget på {data.get('budget', 'N/A')}. "
            f"Inkludera break-even-analys, förväntad vinst över tid (1, 2 och 3 år), och ge realistiska prognoser."
        )
        roi_analys = generate_chatgpt_response(roi_prompt)
        st.write(roi_analys)
        st.session_state.conversation_history.append({"role": "user", "content": "ROI-analys för min verksamhet"})
        st.session_state.conversation_history.append({"role": "assistant", "content": roi_analys})
    
    # Finansieringsalternativ
    section_title("Finansieringsalternativ", icon="🏦")
    if st.button("Visa finansieringsalternativ", help="Se olika finansieringsmöjligheter för din affärsidé."):
        data = st.session_state.user_data
        financing_prompt = (
            f"Ge mig en översikt över olika finansieringsalternativ för att starta en butik för {data.get('produktutbud', 'N/A')} "
            f"i Sverige. Inkludera information om banklån, crowdfunding, Almi, riskkapital, etc. "
            f"Vad skulle vara mest lämpligt för ett företag med en budget på {data.get('budget', 'N/A')}?"
        )
        finansiering = generate_chatgpt_response(financing_prompt)
        st.write(finansiering)
        st.session_state.conversation_history.append({"role": "user", "content": "Finansieringsalternativ för min verksamhet"})
        st.session_state.conversation_history.append({"role": "assistant", "content": finansiering})
    
    if st.button("Gå vidare till affärsplan"):
        st.session_state.current_stage = "business_plan"
        st.rerun()
    st.markdown('<br>', unsafe_allow_html=True) 