# frontend/components/sidebar.py

import streamlit as st
import json
import os
from datetime import datetime
import time

def create_sidebar():
    """Skapar sidomenyn med navigation och projekthantering"""
    with st.sidebar:
        st.markdown("## 📊 Affärsplan")
        
        # Navigering mellan steg
        st.markdown("### 🧭 Navigation")
        
        # Dynamisk styling baserat på aktuellt steg
        current_stage = st.session_state.current_stage
        
        # -----------------------------
        # Navigationsknappar (huvudflöde)
        # -----------------------------
        buttons_data = [
            {"label": "Introduktion", "stage": "intro", "icon": "📝"},
            {"label": "Grundläggande information", "stage": "basic_info", "icon": "🏢"},
            {"label": "Fördjupad analys", "stage": "deep_dive", "icon": "🔎"},
            {"label": "Ekonomisk planering", "stage": "financial", "icon": "💰"},
            {"label": "Affärsplan", "stage": "business_plan", "icon": "📋"},
        ]
        
        for btn in buttons_data:
            # Active state styling
            is_active = current_stage == btn["stage"]
            btn_style = "primary" if is_active else "secondary"
            
            if st.button(
                f"{btn['icon']} {btn['label']}", 
                key=f"nav_{btn['stage']}", 
                type=btn_style,
                use_container_width=True
            ):
                # Vid klick, ändra steg och ladda om sidan
                st.session_state.current_stage = btn["stage"]
                st.rerun()
        
        # -----------------------------
        # Separat sektion för analys
        # -----------------------------

        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("---")
        st.markdown("### 🔍 Avancerad analys")

        # Knappen för interaktiv affärsanalys
        ia_active = current_stage == "business_analysis"
        ia_style = "primary" if ia_active else "secondary"

        if st.button("📊 Interaktiv affärsanalys", key="nav_business_analysis", type=ia_style, use_container_width=True):
            st.session_state.current_stage = "business_analysis"
            st.rerun()
        
        # Ladda/Spara data
        st.markdown("### 💾 Spara/Ladda")
        
        # Spara data till JSON
        if st.button("Spara progress", key="save_progress", use_container_width=True):
            try:
                # Skapa folder om den inte finns
                os.makedirs("data", exist_ok=True)
                
                # Spara userdata, konversation, stage, mm
                data_to_save = {
                    "user_data": st.session_state.user_data,
                    "conversation_history": st.session_state.conversation_history,
                    "current_stage": st.session_state.current_stage,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
                
                # Spara med timestamp för filnamn
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"data/affarsplan_{timestamp}.json"
                
                with open(filename, "w", encoding="utf-8") as f:
                    json.dump(data_to_save, f, ensure_ascii=False, indent=2)
                
                st.success(f"Sparade data till {filename}")
                
                # Spara även till senaste-fil för snabbladdning
                with open("data/affarsplan_senaste.json", "w", encoding="utf-8") as f:
                    json.dump(data_to_save, f, ensure_ascii=False, indent=2)
                
            except Exception as e:
                st.error(f"Ett fel uppstod vid sparande: {e}")
        
        # Ladda senaste data
        if st.button("Ladda senaste", key="load_latest", use_container_width=True):
            try:
                if os.path.exists("data/affarsplan_senaste.json"):
                    with open("data/affarsplan_senaste.json", "r", encoding="utf-8") as f:
                        loaded_data = json.load(f)
                    
                    # Återställ data från filen
                    st.session_state.user_data = loaded_data.get("user_data", {})
                    st.session_state.conversation_history = loaded_data.get("conversation_history", [])
                    st.session_state.current_stage = loaded_data.get("current_stage", "intro")
                    
                    timestamp = loaded_data.get("timestamp", "okänd tidpunkt")
                    st.success(f"Laddade data från {timestamp}")
                    time.sleep(1)  # Kort paus för att visa meddelandet
                    st.rerun()
                else:
                    st.warning("Ingen tidigare sparad data hittades.")
            except Exception as e:
                st.error(f"Ett fel uppstod vid laddning: {e}")
        
        # Lista tidigare filer
        saved_files = []
        if os.path.exists("data"):
            saved_files = [f for f in os.listdir("data") if f.startswith("affarsplan_") and f.endswith(".json") and f != "affarsplan_senaste.json"]
        
        if saved_files:
            st.markdown("### 📁 Tidigare sparade")
            selected_file = st.selectbox("Välj fil att ladda:", saved_files, key="file_select")
            
            if st.button("Ladda vald fil", key="load_selected", use_container_width=True):
                try:
                    with open(f"data/{selected_file}", "r", encoding="utf-8") as f:
                        loaded_data = json.load(f)
                    
                    # Återställ data från filen
                    st.session_state.user_data = loaded_data.get("user_data", {})
                    st.session_state.conversation_history = loaded_data.get("conversation_history", [])
                    st.session_state.current_stage = loaded_data.get("current_stage", "intro")
                    
                    timestamp = loaded_data.get("timestamp", "okänd tidpunkt")
                    st.success(f"Laddade data från {timestamp}")
                    time.sleep(1)  # Kort paus för att visa meddelandet
                    st.rerun()
                except Exception as e:
                    st.error(f"Ett fel uppstod vid laddning: {e}")
        
        # Om vi kommer såhär långt i sidebaren, visa lite information om verktyget
        with st.expander("ℹ️ Om verktyget"):
            st.markdown("""
            **Interaktiv Affärsplan**
            
            Ett verktyg för att skapa professionella affärsplaner med hjälp av AI.
            
            Fyll i din information steg för steg och få en komplett affärsplan genererad med analys och rekommendationer.
            """)

        # Visa footer
        st.sidebar.markdown("---")
        st.sidebar.markdown("© 2023 Affärsplan-verktyget") 