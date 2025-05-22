# frontend/pages/deep_dive_page.py

import streamlit as st
import streamlit.components.v1 as components
from frontend.components.ui_components import (
    progress_bar, 
    info_box, 
    success_box, 
    warning_box,
    section_title
)
from backend.openai_utils import (
    generate_chatgpt_response, 
    generate_logo, 
    generate_swot_analysis, 
    create_swot_diagram, 
    generate_company_manifest
)
from backend.google import generate_competitor_map

def deep_dive_page():
    """Sida för fördjupad analys av användarens affärsidé"""
    st.title("Fördjupad analys")
    progress_bar(st.session_state.current_stage)
    st.write("Låt oss gå djupare i några viktiga aspekter för din affärsplan.")
    
    # Visa tidigare svar
    with st.expander("Sammanfattning av dina svar hittills"):
        for key, value in st.session_state.user_data.items():
            st.write(f"**{key.capitalize()}:** {value}")
    
    # Företagsnamn
    foretagsnamn = st.text_input("Vad ska företaget heta?", key="foretagsnamn")
    if foretagsnamn:
        st.session_state.user_data["foretagsnamn"] = foretagsnamn
        
        # Logotypgenereringsalternativ
        section_title("Logotypgenerering", icon="🎨")
        logo_options = st.radio(
            "Välj alternativ för logotypgenerering:",
            ["Standard logotyp", "Anpassad DALL-E 3 logotyp (avancerad)"],
            key="logo_option"
        )
        
        if logo_options == "Standard logotyp":
            st.session_state.custom_logo_mode = False
            if st.button("Generera standardlogotyp"):
                with st.spinner("Genererar logotyp..."):
                    try:
                        logo_url = generate_logo(foretagsnamn, st.session_state.user_data.get('produktutbud', 'produkter'))
                        st.session_state.logo_url = logo_url
                        st.image(logo_url, caption=f"Logotyp för {foretagsnamn}", width=250)
                        success_box("Logotyp genererad! Den kommer att inkluderas i din affärsplan.")
                    except Exception as e:
                        warning_box(f"Kunde inte generera logotyp: {str(e)}")
        else:
            st.session_state.custom_logo_mode = True
            prompt = st.text_area(
                "Beskriv din önskade logotyp i detalj:",
                "Skapa en modern, professionell logotyp för ett företag som heter " + foretagsnamn + 
                " som säljer " + st.session_state.user_data.get('produktutbud', 'produkter') + 
                ". Använd en stilren design med rena linjer och en elegant färgpalett."
            )
            
            if st.button("Generera anpassad logotyp"):
                with st.spinner("Genererar anpassad logotyp med DALL-E 3..."):
                    try:
                        from app import generate_custom_logo
                        logo_url = generate_custom_logo(prompt)
                        st.session_state.logo_url = logo_url
                        st.image(logo_url, caption=f"Anpassad logotyp för {foretagsnamn}", width=250)
                        success_box("Anpassad logotyp genererad! Den kommer att inkluderas i din affärsplan.")
                    except Exception as e:
                        warning_box(f"Kunde inte generera anpassad logotyp: {str(e)}")
    
    # Marknadssegment
    section_title("Marknadssegmentering", icon="👥")
    segment_options = ["Privatpersoner", "Företag", "Offentlig sektor", "Både privat och företag"]
    marknadssegment = st.multiselect("Vilka marknadssegment vill du rikta in dig på?", segment_options)
    if marknadssegment:
        st.session_state.user_data["marknadssegment"] = marknadssegment
    
    # Konkurrenter
    section_title("Konkurrentanalys", icon="⚔️")
    konkurrenter = st.text_area("Vilka är dina huvudsakliga konkurrenter? (Om du vet)")
    if konkurrenter:
        st.session_state.user_data["konkurrenter"] = konkurrenter
        # Analysera konkurrenterna
        if st.button("Analysera konkurrenter", help="Få en AI-genererad analys av dina konkurrenter baserat på din input."):
            info_box("Analyserar konkurrenter...")
            stad = st.session_state.user_data.get("stad", "")
            produkter = st.session_state.user_data.get("produktutbud", "")
            konkurrent_analys = generate_chatgpt_response(
                f"Gör en konkurrentanalys för försäljning av {produkter} i {stad}. "
                f"Fokusera specifikt på konkurrenterna {konkurrenter}. "
                f"Inkludera deras styrkor, svagheter och hur man kan differentiera sig från dem."
            )
            st.write(konkurrent_analys)
            st.session_state.conversation_history.append({"role": "user", "content": f"Konkurrentanalys för {konkurrenter}"})
            st.session_state.conversation_history.append({"role": "assistant", "content": konkurrent_analys})
    
    # SWOT-analys
    section_title("SWOT-analys", icon="📊")
    if st.button("Generera SWOT-analys", help="Få en SWOT-analys (styrkor, svagheter, möjligheter, hot) för din affärsidé."):
        with st.spinner("Genererar SWOT-analys..."):
            swot_text = generate_swot_analysis(st.session_state.user_data)
            st.session_state.swot_analysis = swot_text
            
            # Visa text-SWOT
            info_box("SWOT-analys genererad! Se nedan.", icon="📊")
            st.write(swot_text)
            
            # Skapa och visa SWOT-diagram
            swot_image = create_swot_diagram(swot_text)
            st.session_state.swot_image = swot_image
            st.image(swot_image, caption="SWOT-diagram", use_column_width=True)
            
            # Spara i konversationshistoriken
            st.session_state.conversation_history.append({"role": "user", "content": "Generera SWOT-analys"})
            st.session_state.conversation_history.append({"role": "assistant", "content": swot_text})
    
    # Konkurrentkarta
    section_title("Konkurrentkarta", icon="🗺️")
    
    # Hämta produktutbud och stad från session_state
    produkter = st.session_state.user_data.get("produktutbud", "")
    stad = st.session_state.user_data.get("stad", "")
    bransch = produkter  # Använd produktutbud som bransch
    
    if bransch and stad:
        if st.button("Visa konkurrentkarta", help="Visa en karta med konkurrenter inom din bransch i din stad."):
            with st.spinner(f"Genererar karta för {bransch} i {stad}..."):
                try:
                    # Generera förslag på konkurrenter baserat på bransch
                    konkurrent_prompt = f"""
                    Generera en lista med 4-6 namngivna konkurrentföretag inom {bransch} i {stad}.
                    För varje konkurrent, ange en uppskattad marknadsandel i procent (totalt 100%) och en kort beskrivning.
                    Formatera som: Företag|Marknadsandel|Beskrivning
                    """
                    
                    response = generate_chatgpt_response(konkurrent_prompt)
                    
                    # Extrahera konkurrentdata
                    competitors = []
                    import re
                    
                    # Försök hitta konkurrentdata i svaret
                    for line in response.split('\n'):
                        if '|' in line:
                            parts = line.split('|')
                            if len(parts) >= 2:
                                name = parts[0].strip()
                                try:
                                    share = float(re.search(r'(\d+(?:\.\d+)?)', parts[1]).group(1))
                                    desc = parts[2].strip() if len(parts) > 2 else ""
                                    competitors.append({"name": name, "share": share, "description": desc})
                                except:
                                    pass
                    
                    if not competitors:
                        # Fallback om vi inte kunde extrahera data
                        competitors = [
                            {"name": "Konkurrent A", "share": 35, "description": "Marknadsledare med etablerat varumärke"},
                            {"name": "Konkurrent B", "share": 25, "description": "Innovativ utmanare med lägre priser"},
                            {"name": "Konkurrent C", "share": 15, "description": "Nischad aktör med hög kvalitet"},
                            {"name": "Övriga", "share": 25, "description": "Mindre aktörer på marknaden"}
                        ]
                    
                    # Lägg till ditt eget företag
                    your_share = min(5, sum(c["share"] for c in competitors) * 0.1)  # Max 5% eller 10% av total
                    foretagsnamn = st.session_state.user_data.get("foretagsnamn", "Ditt företag")
                    
                    if your_share > 0:
                        for c in competitors:
                            c["share"] = c["share"] * (100 - your_share) / 100
                        competitors.append({
                            "name": foretagsnamn, 
                            "share": your_share, 
                            "description": "Din position på marknaden"
                        })
                    
                    # Visa konkurrentlista
                    st.markdown("#### Konkurrenter på marknaden")
                    for comp in competitors:
                        if comp["name"] != foretagsnamn:
                            st.markdown(f"**{comp['name']}** ({comp['share']:.1f}%): {comp['description']}")
                    
                    # Generera och visa konkurrentkarta
                    map_html = generate_competitor_map(competitors, stad)
                    
                    # Visa kartan om den genererades framgångsrikt
                    if map_html and len(map_html) > 100:
                        try:
                            # Använd components.html istället för st.markdown
                            st.subheader("Konkurrentkarta")
                            components.html(
                                map_html,
                                height=450,
                                scrolling=False
                            )
                            st.info(f"Kartan visar ungefärliga positioner för konkurrenter i {stad}. "
                                  "Positionerna är baserade på sökningar via Google Places API.")
                        except Exception as render_error:
                            # Fallback till alternativ metod
                            st.error(f"Kunde inte visa kartan: {str(render_error)}")
                            # Skapa en nedladdbar version
                            import tempfile
                            with tempfile.NamedTemporaryFile(delete=False, suffix='.html', mode='w', encoding='utf-8') as f:
                                f.write(map_html)
                                map_path = f.name
                            st.info(f"Karta skapad som HTML-fil. Du kan öppna den manuellt på: {map_path}")
                    else:
                        st.warning("Kunde inte generera konkurrentkarta. Kontrollera att du har en Google Places API-nyckel i .env-filen.")
                except Exception as e:
                    st.error(f"Fel vid generering av karta: {str(e)}")
                    st.warning("För att aktivera kartor, lägg till 'GOOGLE_PLACES_KEY=DIN_API_NYCKEL' i .env-filen.")
    else:
        st.warning("För att visa konkurrentkarta behöver du ange både bransch (produktutbud) och stad i 'Grundläggande information'.")
    
    # Leverantörer
    section_title("Leverantörsanalys", icon="🚚")
    supplier_question = st.text_input("Vill du ha hjälp med att hitta leverantörer? Skriv vad för typ av leverantörer du söker:")
    if supplier_question and st.button("Sök leverantörer", help="Få förslag på leverantörer baserat på din affärsidé och produkt."):
        info_box("Söker leverantörer...")
        produkter = st.session_state.user_data.get("produktutbud", "")
        land = "Sverige"
        supplier_info = generate_chatgpt_response(
            f"Ge specifika rekommendationer på leverantörer för {produkter} i {land}. "
            f"Inkludera namn på företag, eventuella kontaktuppgifter och vad som gör dem lämpliga som leverantörer."
        )
        st.write(supplier_info)
        st.session_state.conversation_history.append({"role": "user", "content": f"Leverantörsanalys för {produkter}"})
        st.session_state.conversation_history.append({"role": "assistant", "content": supplier_info})
    
    # Företagsmanifest
    section_title("Företagsmanifest", icon="📝")
    if st.button("Generera företagsmanifest", help="Få ett inspirerande manifest för ditt företag."):
        with st.spinner("Skapar inspirerande företagsmanifest..."):
            manifest = generate_company_manifest(st.session_state.user_data)
            st.session_state.manifest = manifest
            
            st.markdown("### Ditt företagsmanifest")
            st.markdown(manifest)
            
            # Spara i konversationshistoriken
            st.session_state.conversation_history.append({"role": "user", "content": "Generera företagsmanifest"})
            st.session_state.conversation_history.append({"role": "assistant", "content": manifest})
    
    # Föreslå unikt säljargument
    section_title("Unikt säljargument (USP)", icon="💡")
    if st.button("Föreslå unikt säljargument", help="Få förslag på unika säljargument (USP) för din verksamhet."):
        data = st.session_state.user_data
        usp_prompt = (
            f"Baserat på följande information, föreslå ett starkt unikt säljargument (USP) för verksamheten: "
            f"Stad: {data.get('stad', 'N/A')}, Målgrupp: {data.get('malgrupp', 'N/A')}, "
            f"Produkter: {data.get('produktutbud', 'N/A')}, Strategi: {data.get('strategi', 'N/A')}. "
            f"Ge tre olika alternativ med förklaring."
        )
        usp_förslag = generate_chatgpt_response(usp_prompt)
        st.write(usp_förslag)
        st.session_state.conversation_history.append({"role": "user", "content": "Förslag på unikt säljargument"})
        st.session_state.conversation_history.append({"role": "assistant", "content": usp_förslag})
    
    if st.button("Gå vidare till ekonomisk planering"):
        st.session_state.current_stage = "financial"
        st.rerun()
    st.markdown('<br>', unsafe_allow_html=True) 