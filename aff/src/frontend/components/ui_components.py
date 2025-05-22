# frontend/components/ui_components.py

import streamlit as st

def info_box(text, icon="ℹ️"):
    """Visar en informationsruta i glassmorphism-stil"""
    st.markdown(f"""
    <div style='background: rgba(32, 32, 64, 0.4); 
                border: 1px solid rgba(115, 194, 251, 0.3); 
                padding: 1.5em 1.8em; 
                border-radius: 12px; 
                margin: 1.5em 0; 
                font-size: 1em;
                color: #f8f8ff;
                backdrop-filter: blur(5px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                overflow: visible;
                display: block;
                width: 100%;
                clear: both;'>
        <div style="display: flex; align-items: flex-start; gap: 1em;">
            <span style='font-size: 1.5em; flex-shrink: 0;'>{icon}</span>
            <span style="flex-grow: 1; line-height: 1.6;">{text}</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

def success_box(text, icon="✅"):
    """Visar en lyckad-ruta i glassmorphism-stil"""
    st.markdown(f"""
    <div style='background: rgba(25, 64, 25, 0.4); 
                border: 1px solid rgba(92, 184, 92, 0.4); 
                padding: 1.5em 1.8em; 
                border-radius: 12px; 
                margin: 1.5em 0; 
                font-size: 1em;
                color: #f8f8ff;
                backdrop-filter: blur(5px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                overflow: visible;
                display: block;
                width: 100%;
                clear: both;'>
        <div style="display: flex; align-items: flex-start; gap: 1em;">
            <span style='font-size: 1.5em; flex-shrink: 0;'>{icon}</span>
            <span style="flex-grow: 1; line-height: 1.6;">{text}</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

def warning_box(text, icon="⚠️"):
    """Visar en varningsruta i glassmorphism-stil"""
    st.markdown(f"""
    <div style='background: rgba(64, 49, 15, 0.4); 
                border: 1px solid rgba(240, 173, 78, 0.4); 
                padding: 1.5em 1.8em; 
                border-radius: 12px; 
                margin: 1.5em 0; 
                font-size: 1em;
                color: #f8f8ff;
                backdrop-filter: blur(5px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                overflow: visible;
                display: block;
                width: 100%;
                clear: both;'>
        <div style="display: flex; align-items: flex-start; gap: 1em;">
            <span style='font-size: 1.5em; flex-shrink: 0;'>{icon}</span>
            <span style="flex-grow: 1; line-height: 1.6;">{text}</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

def section_title(text, icon=None):
    """Visar en sektionsrubrik med valfri ikon och gradient-text"""
    if icon:
        st.markdown(f"""
        <h3 style="font-family: 'Poppins', sans-serif; font-weight: 600; margin-top: 2rem; margin-bottom: 1.5rem; clear: both; width: 100%; display: block;">
            <span style="background: linear-gradient(90deg, #9d81ff, #73c2fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                {icon} {text}
            </span>
        </h3>
        """, unsafe_allow_html=True)
    else:
        st.markdown(f"""
        <h3 style="font-family: 'Poppins', sans-serif; font-weight: 600; margin-top: 2rem; margin-bottom: 1.5rem; clear: both; width: 100%; display: block;">
            <span style="background: linear-gradient(90deg, #9d81ff, #73c2fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                {text}
            </span>
        </h3>
        """, unsafe_allow_html=True)

def progress_bar(stage):
    """Visar en progressbar baserad på användarens aktuella steg"""
    stages = ['intro', 'basic_info', 'deep_dive', 'financial', 'business_plan']
    labels = ["Start", "Info", "Analys", "Ekonomi", "Plan"]
    # Beräkna procentandel för progressbaren
    progress_val = (stages.index(stage) + 1) / len(stages)
    
    # Använd Streamlit's inbyggda progressbar med anpassad höjd 
    st.markdown('<style>.stProgress > div > div > div {height: 8px !important; border-radius: 10px !important; background: linear-gradient(90deg, #9d81ff, #73c2fb) !important;}</style>', unsafe_allow_html=True)
    st.progress(progress_val)
    
    # Visa stegtext med anpassad HTML för att matcha designen
    st.markdown("""
    <div style="display: flex; justify-content: space-between; margin: 15px 0 30px 0; clear: both; width: 100%;">
    """, unsafe_allow_html=True)
    
    cols = st.columns(len(labels))
    for i, (s, l) in enumerate(zip(stages, labels)):
        if s == stage:
            cols[i].markdown(f"""
            <div style="text-align: center; width: 100%; display: block;">
                <p style="font-weight: 600; font-size: 0.95rem; margin-bottom: 0;
                          background: linear-gradient(90deg, #9d81ff, #73c2fb); 
                          -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                    {l}
                </p>
            </div>
            """, unsafe_allow_html=True)
        else:
            cols[i].markdown(f"""
            <div style="text-align: center; width: 100%; display: block;">
                <p style="color: rgba(248, 248, 255, 0.6); font-size: 0.95rem; margin-bottom: 0;">
                    {l}
                </p>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("""
    </div>
    <div style="height: 1px; background: linear-gradient(90deg, rgba(157, 129, 255, 0.1), rgba(157, 129, 255, 0.3), rgba(157, 129, 255, 0.1)); margin: 0 0 30px 0; clear: both; width: 100%;"></div>
    """, unsafe_allow_html=True)

def display_chat_history(conversation_history):
    """Visar konversationshistoriken med förbättrad styling"""
    for i, message in enumerate(conversation_history):
        if message["role"] == "user":
            st.markdown(f"""
            <div style="background: rgba(32, 32, 64, 0.4); 
                        border: 1px solid rgba(157, 129, 255, 0.2); 
                        border-radius: 12px 12px 2px 12px;
                        padding: 1em 1.5em;
                        margin: 1em 0 1em auto;
                        max-width: 85%;
                        color: #f8f8ff;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        clear: both;
                        float: right;">
                <div style="font-weight: 600; margin-bottom: 0.5em; color: #9d81ff;">Du</div>
                <div style="line-height: 1.6;">{message["content"]}</div>
            </div>
            <div style="clear: both;"></div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div style="background: rgba(24, 24, 48, 0.5); 
                        border: 1px solid rgba(115, 194, 251, 0.2); 
                        border-radius: 12px 12px 12px 2px;
                        padding: 1em 1.5em;
                        margin: 1em auto 1em 0;
                        max-width: 85%;
                        color: #f8f8ff;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        clear: both;
                        float: left;">
                <div style="font-weight: 600; margin-bottom: 0.5em; background: linear-gradient(90deg, #9d81ff, #73c2fb); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Affärsrådgivaren</div>
                <div style="line-height: 1.6;">{message["content"]}</div>
            </div>
            <div style="clear: both;"></div>
            """, unsafe_allow_html=True) 