# frontend/pages/business_plan_page.py

import streamlit as st
import os
from frontend.components.ui_components import (
    progress_bar, 
    section_title, 
    display_chat_history,
    success_box,
    warning_box
)
from backend.openai_utils import generate_chatgpt_response
from backend.pdf_utils import create_pdf_report, get_pdf_download_link

def business_plan_page():
    """Sida för att generera och visa den kompletta affärsplanen"""
    st.title("Din kompletta affärsplan")
    progress_bar(st.session_state.current_stage)
    
    # Visa sammanfattning
    with st.expander("Översikt över affärsplansdata", expanded=True):
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Företagsinformation")
            st.write(f"**Företagsnamn:** {st.session_state.user_data.get('foretagsnamn', 'Ej angivet')}")
            st.write(f"**Stad:** {st.session_state.user_data.get('stad', 'Ej angivet')}")
            st.write(f"**Produkter:** {st.session_state.user_data.get('produktutbud', 'Ej angivet')}")
            st.write(f"**Strategi:** {st.session_state.user_data.get('strategi', 'Ej angivet')}")
            
        with col2:
            st.subheader("Status")
            if 'logo_url' in st.session_state and st.session_state.logo_url:
                st.write("✅ Logotyp genererad")
                st.image(st.session_state.logo_url, width=100)
            else:
                st.write("❌ Logotyp ej genererad")
                
            if 'swot_analysis' in st.session_state and st.session_state.swot_analysis:
                st.write("✅ SWOT-analys klar")
            else:
                st.write("❌ SWOT-analys ej genomförd")
                
            if 'manifest' in st.session_state and st.session_state.manifest:
                st.write("✅ Företagsmanifest klart")
            else:
                st.write("❌ Företagsmanifest ej skapat")
                
            if 'affarsplan' in st.session_state.user_data:
                st.write("✅ Affärsplan genererad")
            else:
                st.write("❌ Affärsplan ej genererad")
    
    # Generera affärsplan
    section_title("Affärsplan", icon="📑")
    if st.button("Generera komplett affärsplan", help="Få en komplett, AI-genererad affärsplan baserat på dina svar."):
        data = st.session_state.user_data
        prompt = (
            f"Jag vill öppna en butik i {data.get('stad', 'N/A')} med målgruppen {data.get('malgrupp', 'N/A')}. "
            f"Jag ska sälja {data.get('produktutbud', 'N/A')} och siktar på en '{data.get('strategi', 'N/A')}'-strategi. "
            f"Jag vill starta inom {data.get('tidsplan', 'N/A')} med en budget på {data.get('budget', 'N/A')}. "
            f"Min erfarenhet inom området är: {data.get('erfarenhet', 'Begränsad')}. "
            f"Företaget ska heta: {data.get('foretagsnamn', 'Ej namngivet ännu')}. "
            "Ge mig en utförlig och futuristisk affärsplan, med tips på marknadsföring, "
            "konkurrentanalys, hur jag bäst får tag på leverantörer, och en detaljerad ekonomisk plan. "
            "Affärsplanen ska ha professionell struktur med rubriker och tydliga avsnitt."
        )
        
        with st.spinner("Genererar din skräddarsydda affärsplan... (detta kan ta upp till 30 sekunder)"):
            affarsplan = generate_chatgpt_response(prompt, temperature=0.7)
            st.session_state.user_data["affarsplan"] = affarsplan
        
        st.markdown(affarsplan)
    
    # Visa affärsplanen om den redan har genererats
    if 'affarsplan' in st.session_state.user_data:
        with st.expander("Visa tidigare genererad affärsplan"):
            st.markdown(st.session_state.user_data["affarsplan"])
    
    # Knapp för att skapa PDF
    section_title("PDF-rapport", icon="🖨️")
    if st.button("Skapa PDF-rapport", help="Ladda ner din affärsplan som en snygg PDF-rapport."):
        with st.spinner("Skapar PDF-rapport med all din affärsinformation..."):
            try:
                pdf_path = create_pdf_report(
                    st.session_state.user_data,
                    swot_text=st.session_state.get('swot_analysis', None),
                    swot_image=st.session_state.get('swot_image', None),
                    manifest=st.session_state.get('manifest', None),
                    logo_url=st.session_state.get('logo_url', None)
                )
                st.session_state.pdf_path = pdf_path
                success_box(f"PDF skapad! Filnamn: {pdf_path}")
                
                # Visa länk för att ladda ner PDF
                download_link = get_pdf_download_link(pdf_path, "Klicka här för att ladda ner din affärsplan som PDF")
                st.markdown(download_link, unsafe_allow_html=True)
            except Exception as e:
                warning_box(f"Ett fel uppstod när PDF-filen skulle skapas: {str(e)}")
    
    # Om PDF redan har skapats tidigare, visa nedladdningslänk
    if 'pdf_path' in st.session_state and st.session_state.pdf_path and os.path.exists(st.session_state.pdf_path):
        download_link = get_pdf_download_link(st.session_state.pdf_path, "Ladda ner din senaste affärsplan som PDF")
        st.markdown(download_link, unsafe_allow_html=True)
    
    # Frågesektion
    section_title("Har du frågor om din affärsplan?", icon="❓")
    user_question = st.text_input("Ställ en fråga om din affärsplan eller affärsidé:")
    
    if user_question and st.button("Få svar"):
        data = st.session_state.user_data
        context = (
            f"Fråga om affärsplan för att sälja {data.get('produktutbud', 'produkter')} "
            f"i {data.get('stad', 'en stad')} med en {data.get('strategi', 'ospecificerad')}-strategi."
        )
        
        # Lägg till frågan i konversationshistoriken
        st.session_state.conversation_history.append({"role": "user", "content": user_question})
        
        # Generera svar med historik för kontext
        answer = generate_chatgpt_response(
            f"Baserat på följande kontext: {context}\n\nFråga: {user_question}", 
            history=st.session_state.conversation_history[-10:] if len(st.session_state.conversation_history) > 0 else []
        )
        
        # Lägg till svaret i konversationshistoriken
        st.session_state.conversation_history.append({"role": "assistant", "content": answer})
        
        # Visa svaret
        st.write("**Svar:**")
        st.write(answer)
    
    # Visa konversationshistorik
    if len(st.session_state.conversation_history) > 0:
        with st.expander("Tidigare frågor och svar"):
            display_chat_history(st.session_state.conversation_history)
    st.markdown('<br>', unsafe_allow_html=True) 