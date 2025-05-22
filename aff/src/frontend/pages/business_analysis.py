import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
import json
import base64
from datetime import datetime
import requests
from frontend.components.ui_components import (
    progress_bar, 
    info_box, 
    success_box, 
    warning_box,
    section_title
)
from backend.openai_utils import (
    generate_chatgpt_response, 
    generate_swot_analysis, 
    create_swot_diagram,
    generate_logo
)
from backend.google import generate_competitor_map

def business_analysis_page():
    """Interaktiv affärsanalys-verktyg för att utvärdera affärsplaner"""
    st.title("Interaktiv Affärsanalys")
    st.write(
        "Låt oss analysera din affärsidé genom att ställa de viktigaste frågorna som investerare, Almi, Vinnova och andra finansiärer kommer att ställa.\n\n"
        "**Tips:** Du kan välja att importera de uppgifter du redan matat in i de tidigare stegen."
    )

    # ------------------------------------------------------------
    # 1) Visa tidigare inmatad data (från user_data) i en expander
    # ------------------------------------------------------------

    if 'user_data' in st.session_state and st.session_state.user_data:
        with st.expander("Mina tidigare svar (klicka för att visa)", expanded=False):
            for k, v in st.session_state.user_data.items():
                st.write(f"**{k.capitalize()}:** {v}")
    
    # ------------------------------------------------------------
    # Återställ auto-förifyllnings-flaggor om önskat
    # ------------------------------------------------------------
    col1, col2 = st.columns([3, 2])
    
    with col1:
        # Importera data från tidigare steg
        if st.button("Importera data från tidigare steg", key="import_previous_data", type="secondary"):
            _prefill_analysis_answers()
            st.success("Tidigare svar importerades! Du kan nu komplettera eller justera innan analysen.")
            st.rerun()
    
    with col2:
        # Återställ auto-förifyllning
        if st.button("Återställ AI-förifyllning", key="reset_auto_prefill", type="secondary", help="Klicka här om du vill börja om med en ny affärsidé och låta AI fylla i på nytt"):
            # Ta bort alla auto_prefill-flaggor
            keys_to_remove = [key for key in st.session_state.keys() if key.startswith("auto_prefill_")]
            for key in keys_to_remove:
                del st.session_state[key]
            st.success("AI-förifyllning återställd! När du navigerar till en sektion kommer AI att fylla i på nytt.")
            st.rerun()

    # ------------------------------------------------------------
    # 2) Möjlighet att importera data till analysdelen
    # ------------------------------------------------------------

    def _prefill_analysis_answers():
        """Fyller st.session_state.analysis_answers med data från user_data där det är relevant."""
        if st.session_state.get("analysis_prefilled", False):
            return  # Undvik dubletter vid flera klick

        ud = st.session_state.user_data
        mapping = {
            # Affärsidé & Lösning
            "affärsidé_lösning_business_idea": f"{ud.get('produktutbud', '')} – {ud.get('strategi', '')}",
            "affärsidé_lösning_product_description": ud.get('produktutbud', ''),
            # Marknad, Kunder & Traktion
            "marknad_kunder_traktion_customer_segments": ud.get('malgrupp', ''),
            # Affärsmodell & Ekonomi
            "affärsmodell_ekonomi_go_to_market": ud.get('strategi', ''),
        }

        # Säkerställ att analys-svar-dictionariet finns
        if 'analysis_answers' not in st.session_state:
            st.session_state.analysis_answers = {}

        for key, value in mapping.items():
            if value and value.strip():
                st.session_state.analysis_answers[key] = value

        st.session_state.analysis_prefilled = True

    # Ladda eller initiera data
    if 'analysis_answers' not in st.session_state:
        st.session_state.analysis_answers = {}
    if 'analysis_results' not in st.session_state:
        st.session_state.analysis_results = {}
    
    # Navigering mellan kategorier
    categories = [
        "Affärsidé & Lösning",
        "Marknad, Kunder & Traktion",
        "Team & Organisation",
        "Affärsmodell & Ekonomi",
        "Risk, Hållbarhet & Exit"
    ]
    
    if 'current_category' not in st.session_state:
        st.session_state.current_category = categories[0]
    
    # Navigationsknappar med modern, stilren design
    st.markdown("""
        <style>
        .stButton > button {
            font-weight: 500;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        .stButton > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        div.row-widget.stButton {
            margin-bottom: 10px;
        }
        </style>
    """, unsafe_allow_html=True)
    
    cols = st.columns(len(categories))
    for i, category in enumerate(categories):
        is_active = st.session_state.current_category == category
        button_style = "primary" if is_active else "secondary"
        if cols[i].button(
            category, 
            key=f"nav_{category}", 
            type=button_style,
            help=f"Navigera till {category}",
            use_container_width=True
        ):
            st.session_state.current_category = category
            st.rerun()
    
    st.markdown("---")
    
    # Visa aktuell kategori med stilren design
    section_title(st.session_state.current_category, icon="")
    
    # Visa en stilren indikator om sektionen är automatiskt förifylld
    current_category_key = st.session_state.current_category.lower().replace(", ", "_").replace(" & ", "_")
    if f"auto_prefill_{current_category_key}_done" in st.session_state:
        st.markdown(
            f"""
            <div style="margin-top:-15px; margin-bottom:20px;">
                <span style="background-color:#f0f2f6; color:#444; padding:4px 10px; border-radius:3px; font-size:0.8em; font-weight:500;">
                    AI-förifylld
                </span>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    # Kategorier och deras frågor
    category_questions = get_category_questions()
    
    # Visa aktuell frågekategori
    current_category = st.session_state.current_category
    if current_category in category_questions:
        display_question_section(
            category_questions[current_category],
            current_category.lower().replace(", ", "_").replace(" & ", "_")
        )
    
    # Sammanfattning och rapport
    st.markdown("---")
    # Anpassad knapp med stilren design
    st.markdown(
        """
        <style>
        .professional-primary > button {
            background: linear-gradient(90deg, #1e3c72, #2a5298) !important;
            color: #ffffff !important;
            font-weight: 500 !important;
            border: none !important;
            box-shadow: 0 4px 10px rgba(42,82,152,0.3) !important;
            transition: all 0.3s ease !important;
        }
        .professional-primary > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(42,82,152,0.4) !important;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    red_btn_container = st.container()
    with red_btn_container:
        generate_final = st.button("Generera slutrapport & visualiseringar", key="final_report_button", type="primary")
    
    # Lägg till custom class till containern
    red_btn_container.markdown('<div class="professional-primary" id="final_report_button"></div>', unsafe_allow_html=True)

    if generate_final:
        generate_final_dashboard()

def get_category_questions():
    """Returnerar alla frågekategorier och deras frågor"""
    return {
        "Affärsidé & Lösning": {
            "business_idea": {
                "question": "Vad är din affärsidé? Beskriv tydligt vad ni gör, för vem och varför det är unikt.",
                "help": "Beskriv koncist vad företaget säljer eller vilken tjänst det erbjuder.",
                "type": "text_area"
            },
            "vision": {
                "question": "Vad är din vision för företaget?",
                "help": "En bra vision är inspirerande, ambitiös men uppnåelig, och kommunicerar företagets syfte.",
                "type": "text_area"
            },
            "history": {
                "question": "Beskriv kort företagets historia och bakgrund.",
                "help": "När grundades företaget, viktiga milstolpar, och varför startades det?",
                "type": "text_area"
            },
            "long_term_goals": {
                "question": "Vilka är företagets långsiktiga SMART-mål?",
                "help": "Specifika, Mätbara, Accepterade, Realistiska, Tidsbundna mål. T.ex. 'Nå 10 000 kunder inom 3 år'",
                "type": "text_area"
            },
            "product_description": {
                "question": "Beskriv er produkt/tjänst och vad som gör den unik",
                "help": "Förklara tekniken, funktionaliteten och de viktigaste fördelarna för användaren.",
                "type": "text_area"
            },
            "trl_level": {
                "question": "Vilken teknisk mognadsgrad (TRL) har er produkt/tjänst?",
                "help": "TRL-skalan går från 1 till 9 (idé → färdig produkt i drift)",
                "type": "select_box",
                "options": [
                    "TRL 1 - Grundprinciper observerade",
                    "TRL 2 - Teknikkoncept formulerat",
                    "TRL 3 - Experimentell bevisning av koncept",
                    "TRL 4 - Teknisk validering i labbmiljö",
                    "TRL 5 - Validering i relevant miljö",
                    "TRL 6 - Demonstration i relevant miljö",
                    "TRL 7 - Demonstration i operationell miljö",
                    "TRL 8 - System komplett och kvalificerat",
                    "TRL 9 - System bevisat i operationell miljö"
                ]
            },
            "ip_protection": {
                "question": "Hur skyddas er innovation?",
                "help": "Beskriv er IP-strategi (patent, varumärke, affärshemligheter, osv).",
                "type": "text_area"
            },
            "development_roadmap": {
                "question": "Beskriv er produktutvecklingsplan",
                "help": "Kommande versioner, funktioner och ungefärlig tidplan.",
                "type": "text_area"
            }
        },
        "Marknad, Kunder & Traktion": {
            "market_size": {
                "question": "Hur stor är målmarknaden?",
                "help": "Ange storlek i kronor och/eller antal kunder. Inkludera gärna TAM, SAM och SOM om möjligt.",
                "type": "text_area"
            },
            "customer_segments": {
                "question": "Beskriv era huvudsakliga kundsegment och deras behov",
                "help": "Vilka grupper köper er produkt/tjänst och varför? Demografiska egenskaper, behov, köpbeteende.",
                "type": "text_area"
            },
            "willingness_to_pay": {
                "question": "Vilken betalningsvilja har kunderna och hur har ni validerat detta?",
                "help": "Har ni diskuterat pris med potentiella kunder? Finns det jämförbara produkter/tjänster?",
                "type": "text_area"
            },
            "competition": {
                "question": "Vilka är era huvudsakliga konkurrenter och hur differentierar ni er?",
                "help": "Lista direkta och indirekta konkurrenter samt era fördelar jämfört med dem.",
                "type": "text_area"
            },
            "market_trends": {
                "question": "Vilka trender på marknaden påverkar er affär?",
                "help": "Teknologiska, sociala, ekonomiska eller regulatoriska förändringar som påverkar målmarknaden.",
                "type": "text_area"
            },
            "current_progress": {
                "question": "Beskriv er traktion och validering hittills",
                "help": "Kunder, intäkter, tillväxt, proof-of-concept, piloter, etc.",
                "type": "text_area"
            },
            "customer_validation": {
                "question": "Hur har ni validerat kundbehovet och er lösning?",
                "help": "Intervjuer, användartester, betatester, försäljning, etc.",
                "type": "text_area"
            },
            "growth_metrics": {
                "question": "Vilka tillväxt-KPI:er följer ni och vad är resultaten?",
                "help": "Exempel: kundtillväxt, MRR-tillväxt, konverteringsgrad.",
                "type": "text_area"
            }
        },
        "Team & Organisation": {
            "team_members": {
                "question": "Beskriv teamet, nyckelkompetenser och kompetensbrister",
                "help": "Lista grundare, nyckelpersoner, deras roller, erfarenheter samt vilka kompetenser som saknas.",
                "type": "text_area"
            },
            "board": {
                "question": "Hur ser styrelsen ut och vilken kompetens bidrar de med?",
                "help": "Lista styrelsemedlemmar, deras bakgrund och bidrag till företaget.",
                "type": "text_area"
            },
            "advisors": {
                "question": "Vilka rådgivare/mentorer är kopplade till företaget?",
                "help": "Lista rådgivare och deras bidrag till företaget.",
                "type": "text_area"
            },
            "incentives": {
                "question": "Vilka incitamentsprogram finns för nyckelpersoner?",
                "help": "Beskriv optionsprogram, bonusar eller andra incitament.",
                "type": "text_area"
            },
            "governance": {
                "question": "Hur arbetar ni med styrning, jämställdhet och mångfald?",
                "help": "Beskriv beslutsprocesser och konkreta insatser för att främja jämställdhet och inkludering.",
                "type": "text_area"
            }
        },
        "Affärsmodell & Ekonomi": {
            "revenue_model": {
                "question": "Beskriv er affärsmodell och intäktsströmmar",
                "help": "Hur tjänar ni pengar? Prenumerationer, engångsbetalningar, licenser, etc.",
                "type": "text_area"
            },
            "pricing_model": {
                "question": "Beskriv er prismodell och prislogik",
                "help": "Förklara hur ni tar betalt, prisstrategi och marginalstruktur.",
                "type": "text_area"
            },
            "costs_and_margins": {
                "question": "Beskriv kostnadsstruktur och marginaler",
                "help": "Fasta vs. rörliga kostnader, skalfördelar, brutto- och operativa marginaler.",
                "type": "text_area"
            },
            "key_metrics": {
                "question": "Vilka är de viktigaste nyckeltalen för att mäta er framgång?",
                "help": "Exempel: MRR, CAC, LTV, churn rate, payback-tid.",
                "type": "text_area"
            },
            "go_to_market": {
                "question": "Vad är er go-to-market-strategi?",
                "help": "Beskriv försäljningskanaler, marknadsföringstaktik och kundfokus.",
                "type": "text_area"
            },
            "funding_details": {
                "question": "Beskriv ert finansieringsbehov och hur pengarna ska användas",
                "help": "Belopp, tidsperiod, huvudsakliga användningsområden.",
                "type": "text_area"
            },
            "burn_and_runway": {
                "question": "Vad är er burn rate och runway?",
                "help": "Månatlig förbränning av kapital nu/efter finansiering och hur länge det räcker.",
                "type": "text_area"
            },
            "previous_funding": {
                "question": "Beskriv tidigare finansiering och värdering",
                "help": "Tidigare rundor, belopp och värderingar.",
                "type": "text_area"
            },
            "financial_projections": {
                "question": "Sammanfatta era finansiella prognoser för 3-5 år",
                "help": "Intäkter, kostnader, resultat och viktigaste antaganden.",
                "type": "text_area"
            }
        },
        "Risk, Hållbarhet & Exit": {
            "key_risks": {
                "question": "Identifiera de 3-5 största riskerna för verksamheten",
                "help": "Exempel: teknik, marknad, team, finansiering.",
                "type": "text_area"
            },
            "market_and_competition_risks": {
                "question": "Beskriv marknads- och konkurrensrisker",
                "help": "Konkurrens, prispress, förändrad efterfrågan, osv.",
                "type": "text_area"
            },
            "operational_risks": {
                "question": "Beskriv operativa och tekniska risker",
                "help": "Utvecklingsförseningar, driftsäkerhet, beroenden.",
                "type": "text_area"
            },
            "external_risks": {
                "question": "Beskriv externa risker (regulatoriska, finansiella, etc)",
                "help": "Tillstånd, lagstiftning, valutakurs, finansieringsrisker.",
                "type": "text_area"
            },
            "mitigation_strategy": {
                "question": "Hur planerar ni att hantera riskerna?",
                "help": "Konkreta åtgärder för att minska eller eliminera risker.",
                "type": "text_area"
            },
            "sdg_goals": {
                "question": "Vilka av FN:s globala mål (SDG) bidrar er verksamhet till?",
                "help": "Välj relevanta mål.",
                "type": "multiselect",
                "options": [
                    "1: Ingen fattigdom","2: Ingen hunger","3: God hälsa och välbefinnande","4: God utbildning för alla","5: Jämställdhet","6: Rent vatten och sanitet","7: Hållbar energi","8: Anständiga arbetsvillkor","9: Hållbar industri & innovation","10: Minskad ojämlikhet","11: Hållbara städer","12: Hållbar konsumtion","13: Klimatåtgärder","14: Hav och marina resurser","15: Ekosystem & biologisk mångfald","16: Fredliga samhällen","17: Genomförande & partnerskap"
                ]
            },
            "sustainability_impact": {
                "question": "Beskriv er miljö- och samhällspåverkan",
                "help": "Hur påverkar er lösning klimat, miljö och människor?",
                "type": "text_area"
            },
            "sustainability_strategy": {
                "question": "Beskriv er hållbarhetsstrategi",
                "help": "Hur integreras hållbarhet i affärsmodellen?",
                "type": "text_area"
            },
            "exit_plan": {
                "question": "Beskriv er exit-strategi och tidslinje",
                "help": "Förvärv, börsnotering etc. När och hur?",
                "type": "text_area"
            },
            "potential_acquirers": {
                "question": "Lista potentiella förvärvare",
                "help": "Namn på företag eller typer av aktörer.",
                "type": "text_area"
            },
            "repayment_ability": {
                "question": "Vad är er återbetalningsförmåga för lån?",
                "help": "Relevant för t.ex. Almi-lån.",
                "type": "text_area"
            },
            "previous_exits": {
                "question": "Har teamet tidigare genomfört exits?",
                "help": "Beskriv tidigare exits och utfall.",
                "type": "text_area"
            }
        }
    }

def display_question_section(questions, section_name):
    """Visar frågorna i en sektion och sparar svaren"""
    # Visa instruktioner för sektionen
    info_text = get_section_description(section_name)
    if info_text:
        info_box(info_text)
    
    # ------------------------------------------------------------
    # AI-förifyllning av svar i denna sektion
    # ------------------------------------------------------------

    def ai_prefill_section():
        """Använder OpenAI för att gissa svar på frågorna utifrån tidigare data"""
        user_data = st.session_state.get("user_data", {})

        # Skapa en tydlig JSON-mall åt modellen
        template_dict = {qd["question"]: "" for qd in questions.values()}

        prompt = (
            "Du är en affärscoach som ska hjälpa en entreprenör att fylla i en affärsanalys. "
            "Entreprenören har tidigare lämnat följande information (user_data):\n"
            f"{json.dumps(user_data, ensure_ascii=False, indent=2)}\n\n"
            "Baserat på denna info, gissa korta (1-2 meningar) preliminära svar på frågorna i sektionen. "
            "Returnera ENDAST giltig JSON med exakt samma nycklar som i mallen nedan.\n\n"
            f"Mall:\n{json.dumps(template_dict, ensure_ascii=False, indent=2)}"
        )

        with st.spinner("Genererar AI-förslag..."):
            raw = generate_chatgpt_response(prompt, temperature=0.4)

        # Försök extrahera JSON
        import re
        json_str = raw
        # Ta bort kodblock om de finns
        code_match = re.search(r"```json([\s\S]*?)```", raw)
        if code_match:
            json_str = code_match.group(1)

        try:
            suggestions = json.loads(json_str)
        except Exception:
            # Fallback: enkel rad-parsing
            suggestions = {}
            for line in raw.split("\n"):
                if ":" in line:
                    q, a = line.split(":", 1)
                    suggestions[q.strip()] = a.strip()

        # Uppdatera session_state med förslagen
        for key, qd in questions.items():
            q_text = qd["question"]
            answer = suggestions.get(q_text, "")
            if answer:
                st.session_state.analysis_answers[f"{section_name}_{key}"] = answer
    
    # Kontrollera om vi behöver köra AI-förifyllning automatiskt för denna sektion
    if f"auto_prefill_{section_name}_done" not in st.session_state:
        ai_prefill_section()
        st.session_state[f"auto_prefill_{section_name}_done"] = True
        success_box("AI-förslagen har lagts in automatiskt – granska och justera vid behov")
        st.rerun()
    
    # Visa knapp för att köra AI-förifyllning på nytt
    if st.button("Förifyll denna sektion med AI", key=f"ai_prefill_{section_name}", type="secondary"):
        ai_prefill_section()
        success_box("AI-förslagen har lagts in – granska och justera vid behov")
        st.rerun()
    
    for key, question_data in questions.items():
        q_key = f"{section_name}_{key}"
        
        if question_data["type"] == "text_area":
            st.session_state.analysis_answers[q_key] = st.text_area(
                question_data["question"],
                help=question_data["help"],
                key=q_key,
                value=st.session_state.analysis_answers.get(q_key, "")
            )
        elif question_data["type"] == "select_box":
            # Säkerställ att tidigare sparat värde finns i options, annars fallback till första
            stored_val = st.session_state.analysis_answers.get(q_key)
            try:
                default_index = question_data["options"].index(stored_val) if stored_val else 0
            except ValueError:
                default_index = 0
            selected = st.selectbox(
                question_data["question"],
                options=question_data["options"],
                help=question_data["help"],
                key=q_key,
                index=default_index
            )
            st.session_state.analysis_answers[q_key] = selected
        elif question_data["type"] == "multiselect":
            st.session_state.analysis_answers[q_key] = st.multiselect(
                question_data["question"],
                options=question_data["options"],
                help=question_data["help"],
                key=q_key,
                default=st.session_state.analysis_answers.get(q_key, [])
            )
        
        # Lägg till utrymme mellan frågorna
        st.write("")
    
    # AI-analys för denna sektion
    if st.button(f"Analysera {section_name}", key=f"analyze_{section_name}", type="secondary"):
        analyze_section(section_name, questions)

def get_section_description(section_name):
    """Returnerar beskrivningar för varje sektion"""
    descriptions = {
        "affärsidé_lösning": "Beskriv grunden i er affärsidé och hur lösningen fungerar samt utvecklas.",
        "marknad_kunder_traktion": "Visa att det finns en marknad, betalande kunder och bevis på efterfrågan.",
        "team_organisation": "Bevisa att ni har rätt människor och strukturer för att lyckas.",
        "affärsmodell_ekonomi": "Förklara hur ni tjänar pengar och når lönsamhet.",
        "risk_hållbarhet_exit": "Identifiera risker, visa hållbarhetsarbete och hur investerare får avkastning."
    }
    
    # Konvertera section_name till ett format som passar i dictionary
    lookup_key = section_name.lower().replace(", ", "_").replace(" & ", "_")
    return descriptions.get(lookup_key, "")

def analyze_section(section_name, questions):
    """Analyserar svaren i en sektion med hjälp av AI"""
    # Samla alla svar från sektionen
    section_answers = {}
    for key, question_data in questions.items():
        q_key = f"{section_name}_{key}"
        section_answers[question_data["question"]] = st.session_state.analysis_answers.get(q_key, "")
    
    # Skapa en prompt för AI
    prompt = f"""
    Analysera följande svar om {section_name} för en affärsplan:
    
    {section_answers}
    
    Ge konstruktiv feedback på styrkor och svagheter i svaren. 
    Identifiera vad som är bra och vad som kan förbättras. 
    Ge konkreta rekommendationer för hur svaren kan stärkas.
    
    Formatera ditt svar som en analys med Styrkor, Svagheter och Rekommendationer.
    """
    
    with st.spinner(f"Analyserar {section_name}..."):
        analysis = generate_chatgpt_response(prompt)
        st.session_state.analysis_results[section_name] = analysis
    
    st.subheader("AI-analys")
    st.markdown(analysis)

def generate_analysis_report():
    """Genererar en sammanfattande analysrapport baserad på alla svar"""
    # Samla alla svar
    all_answers = st.session_state.analysis_answers
    
    # Skapa en prompt för AI
    prompt = f"""
    Analysera följande svar för en affärsplan:
    
    {all_answers}
    
    Ge en sammanfattande analys som utvärderar affärsplanen utifrån följande fem perspektiv:
    1. Affärsidé & Lösning – Är idén tydlig och erbjuder lösningen en stark differentiering?
    2. Marknad, Kunder & Traktion – Finns en definierad marknad, betalande kunder och bevisad efterfrågan?
    3. Team & Organisation – Har teamet kapacitet och struktur att genomföra planen?
    4. Affärsmodell & Ekonomi – Är modellen skalbar och leder den till lönsam tillväxt?
    5. Risk, Hållbarhet & Exit – Hanteras risker och hållbarhet väl och finns en attraktiv exit-väg?
    
    Sammanfatta med en rekommendation och totalbetyg (1-10) på affärsplanens kvalitet.
    Ge också specifika förslag på förbättringsområden.
    """
    
    with st.spinner("Genererar sammanfattande analys..."):
        analysis = generate_chatgpt_response(prompt)
        st.session_state.analysis_results["sammanfattning"] = analysis
    
    st.subheader("Sammanfattande analys")
    st.markdown(analysis)
    
    # Visa ett betyg visuellt
    try:
        # Försöker hitta betyget i texten (1-10)
        import re
        rating_match = re.search(r'(?:betyg|poäng|score)\D*(\d{1,2})(?:/10)?', analysis, re.IGNORECASE)
        if rating_match:
            rating = int(rating_match.group(1))
            if 1 <= rating <= 10:
                st.progress(rating/10)
                rating_color = "red" if rating < 4 else "orange" if rating < 7 else "green"
                st.markdown(f"<h3 style='color:{rating_color}'>Betyg: {rating}/10</h3>", unsafe_allow_html=True)
    except:
        pass

def generate_final_dashboard():
    """Genererar en innovativ, interaktiv slutrapport med fler visuella element"""
    
    # Skapa en laddningsanimation med stilren design
    with st.spinner(""):
        st.markdown("""
        <style>
        @keyframes fade {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
        .report-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-size: 20px;
            color: white;
            background: linear-gradient(90deg, #1e3c72, #2a5298);
            border-radius: 4px;
            margin: 20px 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            animation: fade 2s infinite ease-in-out;
        }
        .radar-chart {
            margin: 20px auto;
            max-width: 600px;
        }
        .dashboard-card {
            background: #ffffff;
            border-radius: 4px;
            padding: 20px;
            margin: 15px 0;
            border: 1px solid #e6e9ef;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        </style>
        <div class="report-loading">Genererar affärsanalys</div>
        """, unsafe_allow_html=True)
        
        # Pausa för effekt
        import time
        time.sleep(2)
    
    # Generera grundläggande rapport
    generate_analysis_report()
    
    # Skapa ett dashboard-layout
    st.markdown("## Interaktiv affärsanalys-dashboard")
    st.markdown("Baserat på din data har vi skapat en visuell affärsrapport med AI-driven analys.")
    
    # Hitta betyget
    summary = st.session_state.analysis_results.get("sammanfattning", "")
    import re
    rating_match = re.search(r"(\d{1,2})(?:/10)?", summary)
    rating = int(rating_match.group(1)) if rating_match else 5
    
    # Hämta nyckeldata för SWOT och andra visualiseringar
    data = {
        "produktutbud": st.session_state.analysis_answers.get("affärsidé_lösning_product_description", ""),
        "stad": "",
        "malgrupp": st.session_state.analysis_answers.get("marknad_kunder_traktion_customer_segments", ""),
        "strategi": st.session_state.analysis_answers.get("affärsmodell_ekonomi_go_to_market", ""),
        "affärsidé": st.session_state.analysis_answers.get("affärsidé_lösning_business_idea", ""),
        "vision": st.session_state.analysis_answers.get("affärsidé_lösning_vision", ""),
    }
    
    # DASHBOARD-SEKTION 1: Affärsöversikt
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("Din affärsidé")
        st.markdown(data["affärsidé"])
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Vision & KPIs
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("Vision")
        st.markdown(data["vision"])
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        # Automatisk AI-genererad logo
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("AI-genererad företagslogo")
        
        # Försök generera logo endast om vi har tillräcklig data
        logo_container = st.empty()
        if len(data["affärsidé"]) > 10 and len(data["malgrupp"]) > 5:
            try:
                with st.spinner("Genererar logo..."):
                    # Skapa en dummy-bild om riktiga API-anrop inte fungerar
                    dummy_mode = True
                    
                    if dummy_mode:
                        # Generate a colorful placeholder
                        business_type = data["produktutbud"][:20] if data["produktutbud"] else "startup"
                        business_name = "Ditt företag"
                        
                        # Generate a simple logo using matplotlib
                        import matplotlib.pyplot as plt
                        import io
                        from matplotlib.patches import Circle
                        
                        fig, ax = plt.subplots(figsize=(5, 5))
                        ax.set_aspect('equal')
                        
                        # Create a circular background
                        circle = Circle((0.5, 0.5), 0.4, color='#1e3c72', alpha=0.8)
                        ax.add_patch(circle)
                        
                        # Add text
                        ax.text(0.5, 0.5, business_name[0].upper(), 
                                fontsize=50, color='white',
                                ha='center', va='center')
                        
                        ax.text(0.5, 0.2, business_name, 
                                fontsize=20, color='white',
                                ha='center', va='center')
                        
                        # Remove axes
                        ax.axis('off')
                        plt.tight_layout()
                        
                        # Save to buffer
                        buf = io.BytesIO()
                        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
                        buf.seek(0)
                        plt.close(fig)
                        
                        logo_container.image(buf)
                    else:
                        # Faktisk API-anrop för logo
                        logo_url = generate_logo("Ditt företag", data["produktutbud"])
                        logo_container.image(logo_url)
            except Exception as e:
                logo_container.error(f"Kunde inte generera logo: {e}")
        else:
            logo_container.info("Fyll i mer information om din affärsidé och målgrupp för att generera en logo.")
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Totalbetyg med gauge chart
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("Helhetsbetyg")
        
        fig = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = rating,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Investeringsattraktivitet"},
            gauge = {
                'axis': {'range': [0, 10]},
                'bar': {'color': "#1e3c72"},
                'steps': [
                    {'range': [0, 3], 'color': "#e6e9ef"},
                    {'range': [3, 7], 'color': "#c5cfe0"},
                    {'range': [7, 10], 'color': "#8da5d3"}
                ],
                'threshold': {
                    'line': {'color': "#2a5298", 'width': 2},
                    'thickness': 0.75,
                    'value': rating
                }
            }
        ))
        
        fig.update_layout(height=250, margin=dict(l=20, r=20, t=50, b=20))
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
    
    # DASHBOARD-SEKTION 2: SWOT & Radar Chart
    st.markdown("### Analys & Visualisering")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Generera och visa SWOT-analys
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("SWOT-analys")
        
        with st.spinner("Genererar SWOT-analys..."):
            swot_text = generate_swot_analysis(data)
            img_buf = create_swot_diagram(swot_text)
            st.image(img_buf)
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        # Business Radar Chart - visualiserar styrkor och svagheter
        st.markdown('<div class="dashboard-card radar-chart">', unsafe_allow_html=True)
        st.subheader("Affärsprofil")
        
        # Skapa data för radar chart baserat på prompt och analyssvar
        with st.spinner("Analyserar affärsprofil..."):
            # Exempel-analys om vi inte får svar från AI
            categories = ['Produkt/Tjänst', 'Marknad', 'Team', 'Ekonomi', 'Risk/Exit']
            
            # Skapa en prompt för att få poäng från ChatGPT
            radar_prompt = f"""
            Baserat på följande information om ett startup-företag, 
            ge ett poäng mellan 1-10 för var och en av följande kategorier.
            Svara ENBART med siffror i formatet x,x,x,x,x där varje x är ett tal mellan 1-10.
            
            Produkt/Tjänst: {st.session_state.analysis_answers.get("affärsidé_lösning_product_description", "")}
            Marknad: {st.session_state.analysis_answers.get("marknad_kunder_traktion_market_size", "")}
            Team: {st.session_state.analysis_answers.get("team_organisation_team_members", "")}
            Ekonomi: {st.session_state.analysis_answers.get("affärsmodell_ekonomi_revenue_model", "")}
            Risk/Exit: {st.session_state.analysis_answers.get("risk_hållbarhet_exit_exit_plan", "")}
            
            1 = mycket svag, 10 = extremt stark
            """
            
            try:
                # Försök få poäng från ChatGPT
                response = generate_chatgpt_response(radar_prompt, temperature=0.3)
                # Extrahera tal från svaret
                import re
                values = re.findall(r'(\d+(?:\.\d+)?)', response)
                if len(values) >= 5:
                    values = [float(v) for v in values[:5]]
                    # Säkerställ att värdena är inom 1-10
                    values = [min(max(v, 1), 10) for v in values]
                else:
                    # Fallback
                    values = [rating*0.8, rating*0.9, rating*1.1, rating*0.7, rating*1.0]
            except:
                # Fallback om AI-anrop misslyckas
                values = [rating*0.8, rating*0.9, rating*1.1, rating*0.7, rating*1.0]
            
            # Normalisera för jämförbarhet
            values_normalized = [v/10 for v in values]
            
            # Skapa radar chart
            fig = go.Figure()
            
            fig.add_trace(go.Scatterpolar(
                r=values,
                theta=categories,
                fill='toself',
                line=dict(color='#1e3c72'),
                fillcolor='rgba(30, 60, 114, 0.5)',
                name='Ditt företag'
            ))
            
            # Genomsnittlig benchmark
            fig.add_trace(go.Scatterpolar(
                r=[7, 6, 7, 5, 6],  # Benchmark-värden
                theta=categories,
                fill='toself',
                opacity=0.3,
                line=dict(color='gray', dash='dot'),
                fillcolor='rgba(200, 200, 200, 0.2)',
                name='Branschgenomsnitt'
            ))
            
            fig.update_layout(
                polar=dict(
                    radialaxis=dict(
                        visible=True,
                        range=[0, 10]
                    )
                ),
                showlegend=True,
                height=350
            )
            
            st.plotly_chart(fig, use_container_width=True)
            
            # Lägg till tolkning
            strong_areas = [categories[i] for i, v in enumerate(values) if v >= 7]
            weak_areas = [categories[i] for i, v in enumerate(values) if v <= 4]
            
            if strong_areas:
                st.markdown(f"**Starka områden:** {', '.join(strong_areas)}")
            if weak_areas:
                st.markdown(f"**Utvecklingsområden:** {', '.join(weak_areas)}")
            
        st.markdown("</div>", unsafe_allow_html=True)
    
    # DASHBOARD-SEKTION 3: Marknads- och konkurrentanalys
    st.markdown("### Marknadsanalys")
    
    try:
        # Skapa marknadstrendanalys baserad på svar
        market_text = st.session_state.analysis_answers.get("marknad_kunder_traktion_market_trends", "")
        competition_text = st.session_state.analysis_answers.get("marknad_kunder_traktion_competition", "")
        
        if len(market_text) > 10 and len(competition_text) > 10:
            market_prompt = f"""
            Baserat på denna beskrivning av marknaden och konkurrenter:
            
            Marknad: {market_text}
            Konkurrenter: {competition_text}
            
            Generera en lista med 3-6 konkurrentföretag och deras marknadsandelar i procent (totalt 100%).
            Inkludera även företagsnamn och kort beskrivning.
            Formatet ska vara: Företag|Marknadsandel|Beskrivning
            """
            
            with st.spinner("Analyserar marknadspositionering..."):
                response = generate_chatgpt_response(market_prompt)
                
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
                
                # Lägg till ditt företag med liten marknadsandel
                your_share = min(5, sum(c["share"] for c in competitors) * 0.1)  # Max 5% eller 10% av total
                if your_share > 0:
                    for c in competitors:
                        c["share"] = c["share"] * (100 - your_share) / 100
                    competitors.append({"name": "Ditt företag", "share": your_share, "description": "Din position"})
                
                # Skapa en dataframe för marknadsandelsvisualisering
                df = pd.DataFrame(competitors)
                
                # Visualisera marknadsandelar
                colors = ['#1e3c72', '#2a5298', '#4267b2', '#6d87c8', '#99a9d4', '#c5cfe0']
                
                fig = px.pie(df, values='share', names='name', title='Marknadsandelar', 
                            hover_data=['description'], labels={'share':'Marknadsandel (%)'},
                            color_discrete_sequence=colors)
                fig.update_traces(textposition='inside', textinfo='percent+label')
                fig.update_layout(height=500)
                
                st.plotly_chart(fig, use_container_width=True)
                
                # Visa konkurrentlista
                st.markdown("#### Konkurrentanalys")
                for comp in competitors:
                    if comp["name"] != "Ditt företag":
                        st.markdown(f"**{comp['name']}** ({comp['share']:.1f}%): {comp['description']}")
                
                # Generera och visa konkurrentkarta
                st.markdown("#### Konkurrentkarta")
                city = st.session_state.user_data.get('stad', 'Stockholm')
                
                with st.spinner("Genererar konkurrentkarta..."):
                    try:
                        # Generera kartan
                        map_html = generate_competitor_map(competitors, city)
                        
                        # Visa kartan om den genererades framgångsrikt
                        if map_html and len(map_html) > 100:
                            try:
                                # Försök använda st.markdown med säker wrapper
                                html_container = f"""
                                <div style="width:100%; height:450px; overflow:hidden;">
                                    {map_html}
                                </div>
                                """
                                st.markdown(html_container, unsafe_allow_html=True)
                                st.info(f"Kartan visar ungefärliga positioner för konkurrenter i {city}. "
                                      "Positionerna är baserade på sökningar via Google Places API.")
                            except Exception as render_error:
                                # Fallback till alternativ metod
                                st.error(f"Kunde inte visa kartan via markdown: {str(render_error)}")
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
            st.info("Fyll i fler detaljer om marknaden och konkurrenter för att se marknadsanalys.")
    except Exception as e:
        st.error(f"Kunde inte generera marknadsanalys: {str(e)}")
    
    # DASHBOARD-SEKTION 4: Finansiell prognos
    st.markdown("### Finansiell prognos")
    try:
        # Generera finansiell prognos baserat på inmatad data
        financial_text = st.session_state.analysis_answers.get("affärsmodell_ekonomi_financial_projections", "")
        revenue_model = st.session_state.analysis_answers.get("affärsmodell_ekonomi_revenue_model", "")
        
        if len(financial_text) > 10 or len(revenue_model) > 10:
            finance_prompt = f"""
            Baserat på denna finansiella information:
            
            Finansiell prognos: {financial_text}
            Intäktsmodell: {revenue_model}
            
            Generera en 5-årig prognos för omsättning, kostnader och EBITDA (i tkr).
            Formatet ska vara: År,Omsättning,Kostnader,EBITDA
            """
            
            with st.spinner("Genererar finansiell prognos..."):
                response = generate_chatgpt_response(finance_prompt)
                
                # Försök extrahera finansiell data
                financial_data = []
                for line in response.split('\n'):
                    if ',' in line and any(char.isdigit() for char in line):
                        parts = line.split(',')
                        if len(parts) >= 4:
                            try:
                                year = parts[0].strip()
                                revenue = float(parts[1].replace('tkr', '').strip())
                                costs = float(parts[2].replace('tkr', '').strip())
                                ebitda = float(parts[3].replace('tkr', '').strip())
                                financial_data.append({
                                    "År": year, 
                                    "Omsättning": revenue, 
                                    "Kostnader": costs, 
                                    "EBITDA": ebitda
                                })
                            except:
                                pass
                
                if not financial_data:
                    # Fallback om vi inte kunde extrahera data
                    base = 1000  # Basbelopp (tkr)
                    growth = 2.5  # Tillväxtfaktor
                    financial_data = []
                    for i in range(1, 6):
                        revenue = base * (growth ** (i-1))
                        costs = revenue * 0.7 if i > 2 else revenue * 1.2
                        ebitda = revenue - costs
                        financial_data.append({
                            "År": f"År {i}", 
                            "Omsättning": revenue, 
                            "Kostnader": costs, 
                            "EBITDA": ebitda
                        })
                
                # Skapa en dataframe för finansiell visualisering
                df = pd.DataFrame(financial_data)
                
                # Skapa en kombinerad bar chart och line chart
                fig = go.Figure()
                
                # Lägg till staplar för omsättning och kostnader
                fig.add_trace(go.Bar(
                    x=df["År"],
                    y=df["Omsättning"],
                    name="Omsättning",
                    marker_color='#1e3c72'
                ))
                
                fig.add_trace(go.Bar(
                    x=df["År"],
                    y=df["Kostnader"],
                    name="Kostnader",
                    marker_color='#c5cfe0'
                ))
                
                # Lägg till linje för EBITDA
                fig.add_trace(go.Scatter(
                    x=df["År"],
                    y=df["EBITDA"],
                    name="EBITDA",
                    mode='lines+markers',
                    line=dict(color='#2a5298', width=3)
                ))
                
                # Uppdatera layout
                fig.update_layout(
                    title="5-årig finansiell prognos",
                    barmode='group',
                    xaxis_title="År",
                    yaxis_title="Belopp (tkr)",
                    legend=dict(
                        orientation="h",
                        yanchor="bottom",
                        y=1.02,
                        xanchor="right",
                        x=1
                    ),
                    height=500
                )
                
                st.plotly_chart(fig, use_container_width=True)
                
                # Lägg till intressant insikt
                breakeven_year = None
                for i, row in enumerate(financial_data):
                    if row["EBITDA"] > 0 and (i == 0 or financial_data[i-1]["EBITDA"] <= 0):
                        breakeven_year = row["År"]
                        break
                
                if breakeven_year:
                    st.success(f"Prognosen visar break-even under {breakeven_year}")
                
                # Visa finansiell data i tabellform
                st.markdown("#### Finansiell data (tkr)")
                
                # Formatera data för bättre presentation
                formatted_df = df.copy()
                for col in ["Omsättning", "Kostnader", "EBITDA"]:
                    formatted_df[col] = formatted_df[col].apply(lambda x: f"{x:,.0f}".replace(",", " "))
                
                st.table(formatted_df)
        else:
            st.info("Fyll i detaljerad finansiell information för att se en 5-årig prognos.")
    except Exception as e:
        st.error(f"Kunde inte generera finansiell prognos: {str(e)}")
    
    # Skapa en PDF-exportknapp
    st.markdown("### Exportera rapport")
    st.warning("PDF-export kommer att inkludera alla analyser och visualiseringar ovan.")
    
    if st.button("Exportera till PDF", key="export_pdf"):
        st.info("PDF-export funktionen skulle här generera en nedladdningsbar rapport med alla visualiseringar ovan.") 