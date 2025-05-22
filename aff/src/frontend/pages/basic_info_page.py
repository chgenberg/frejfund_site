# frontend/pages/basic_info_page.py

import streamlit as st
from frontend.components.ui_components import progress_bar, info_box
from backend.openai_utils import generate_chatgpt_response

def basic_info_page():
    """Sida för användarens grundläggande information om affärsplanen"""
    st.title(f"Grundläggande information - {st.session_state.user_data.get('namn', 'Din')} Affärsplan")
    progress_bar(st.session_state.current_stage)
    st.write("Först behöver jag veta lite grundläggande information om din affärsidé.")
    st.markdown('<br>', unsafe_allow_html=True)
    
    # 1) Ange stad
    stad = st.text_input("Vilken stad vill du öppna butiken i?", key="stad")
    if stad and stad != st.session_state.user_data.get("stad", ""):
        st.session_state.user_data["stad"] = stad
        # Sök efter information om staden
        with st.expander("Fakta om " + stad):
            info_box("Söker efter information om " + stad + "...")
            stad_info = generate_chatgpt_response(f"Ge mig relevant affärsinformation om {stad} som kan vara användbar för någon som vill starta företag där. Inkludera befolkningsmängd, demografisk information, näringsliv och eventuella unika möjligheter.")
            st.write(stad_info)
    
    # 2) Ange målgrupp
    malgrupp = st.text_input("Vilken är din primära målgrupp?", key="malgrupp")
    if malgrupp:
        st.session_state.user_data["malgrupp"] = malgrupp
    
    # 3) Ange produktutbud
    produktutbud = st.text_input("Vad vill du sälja? (Beskriv så specifikt som möjligt)", key="produktutbud")
    if produktutbud and produktutbud != st.session_state.user_data.get("produktutbud", ""):
        st.session_state.user_data["produktutbud"] = produktutbud
        # Sök efter information om produkten
        with st.expander("Marknadstrender för " + produktutbud):
            info_box("Analyserar marknadstrender...")
            produkt_info = generate_chatgpt_response(f"Ge mig aktuella marknadstrender för försäljning av {produktutbud} i Sverige. Inkludera information om målgrupper, prissättningsstrategier och eventuella unika säljargument.")
            st.write(produkt_info)
    
    # 4) Välj strategi med förklaringar
    strategi_info = {
        "Premium": "Fokuserar på högkvalitativa produkter med högre priser, exklusiv känsla och utmärkt kundservice.",
        "Budget": "Fokuserar på låga priser, volymer och kostnadseffektivitet.",
        "Nisch": "Specialisering inom en specifik del av marknaden, ofta med unika produkter.",
        "Hybrid": "Blandar olika strategier, till exempel genom att erbjuda både premium- och budgetprodukter."
    }
    
    strategi = st.selectbox(
        "Vilken affärsstrategi vill du fokusera på?", 
        list(strategi_info.keys()),
        index=0,
        key="strategi"
    )
    
    info_box(strategi_info[strategi])
    if strategi:
        st.session_state.user_data["strategi"] = strategi
    
    # 5) Tidsplan & Budget
    tidsplan = st.text_input("När vill du starta? (t.ex. 3 månader, 6 månader, 1 år)", key="tidsplan")
    if tidsplan:
        st.session_state.user_data["tidsplan"] = tidsplan
    
    budget = st.text_input("Vilken startbudget har du?", key="budget")
    if budget:
        st.session_state.user_data["budget"] = budget
    
    # 6) Tidigare erfarenhet
    erfarenhet = st.text_area("Beskriv kort din tidigare erfarenhet inom företagande eller branschen:", key="erfarenhet")
    if erfarenhet:
        st.session_state.user_data["erfarenhet"] = erfarenhet
    
    if (stad and malgrupp and produktutbud and strategi and tidsplan and budget):
        if st.button("Fortsätt till fördjupad analys"):
            st.session_state.current_stage = "deep_dive"
            st.rerun()
    st.markdown('<br>', unsafe_allow_html=True) 