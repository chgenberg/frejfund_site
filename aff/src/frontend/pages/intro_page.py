# frontend/pages/intro_page.py

import streamlit as st
from frontend.components.ui_components import progress_bar

def intro_page():
    """Första sidan som användaren ser när de startar appen"""
    st.title("Interaktiv Affärsplan – Din personliga affärsrådgivare")
    progress_bar(st.session_state.current_stage)
    st.write("Välkommen! Jag kommer att guida dig genom processen att skapa en skräddarsydd affärsplan. Vi tar det steg för steg och utforskar möjligheter i realtid.")
    
    # Återanvänd befintligt namn om det finns
    default_name = st.session_state.user_data.get("namn", "")
    namn = st.text_input("Vad heter du?", value=default_name)
    
    if namn:
        st.session_state.user_data["namn"] = namn
        st.write(f"Hej {namn}! Kul att du vill skapa en affärsplan. Klicka på knappen nedan för att börja.")
        
        # Skapa en knapp för att fortsätta
        if st.button("Starta processen", key="start_process_button"):
            st.session_state.current_stage = "basic_info"
            # Använd en JavaScript-omdirigering för att säkerställa att sidan laddas om korrekt
            js_code = """
            <script>
                setTimeout(function() {
                    window.location.reload();
                }, 100);
            </script>
            """
            st.markdown(js_code, unsafe_allow_html=True)
            st.rerun() 