# backend/google.py
from dotenv import load_dotenv
import os
import requests
import textwrap
import webbrowser
import folium
import streamlit as st
from folium.plugins import MarkerCluster
import tempfile

load_dotenv()
API_KEY = os.getenv("GOOGLE_PLACES_KEY")

def text_search(query: str, max_results: int = 5):
    """Söker efter platser via Google Places API och returnerar resultat."""
    if not API_KEY:
        st.warning("Google Places API-nyckel saknas. Lägg till 'GOOGLE_PLACES_KEY' i .env-filen för att aktivera kartor.")
        return []
        
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {"query": query, "key": API_KEY}
    out, fetched = [], 0
    
    try:
        while params and fetched < max_results:
            r = requests.get(url, params=params, timeout=10)
            r.raise_for_status()
            data = r.json()
            for place in data.get("results", []):
                fetched += 1
                out.append(
                    {
                        "name": place["name"],
                        "address": place.get("formatted_address", ""),
                        "rating": place.get("rating", "N/A"),
                        "reviews": place.get("user_ratings_total", 0),
                        "lat": place["geometry"]["location"]["lat"],
                        "lng": place["geometry"]["location"]["lng"],
                    }
                )
                if fetched >= max_results:
                    break
            params = (
                {"pagetoken": data.get("next_page_token"), "key": API_KEY}
                if data.get("next_page_token") and fetched < max_results
                else None
            )
        return out
    except Exception as e:
        st.error(f"Fel vid sökning: {str(e)}")
        return []

def make_map(places: list[dict], city: str = "Stockholm", outfile: str = None):
    """Skapar en karta med markörer för varje plats och sparar som HTML-fil."""
    # Centrera på första träffen eller använd standard för staden
    if places and places[0].get("lat") and places[0].get("lng"):
        center = [places[0]["lat"], places[0]["lng"]]
    else:
        # Default-positioner för vanliga svenska städer
        city_coords = {
            "Stockholm": [59.3293, 18.0686],
            "Göteborg": [57.7089, 11.9746],
            "Malmö": [55.6050, 13.0038],
            "Uppsala": [59.8586, 17.6389],
            "Västerås": [59.6099, 16.5448],
            "Örebro": [59.2753, 15.2134],
            "Linköping": [58.4108, 15.6214]
        }
        center = city_coords.get(city, [59.3293, 18.0686])  # Default till Stockholm
    
    # Skapa karta
    m = folium.Map(location=center, zoom_start=12, tiles="CartoDB positron")
    
    # Använd MarkerCluster för bättre hantering av många markörer
    marker_cluster = MarkerCluster().add_to(m)
    
    # Lägg till varje plats som en markör
    for p in places:
        popup_html = f"""
        <div style='min-width:200px'>
            <h4>{p['name']}</h4>
            <p>{p['address']}</p>
            <p>Betyg: {p['rating']} ({p['reviews']} recensioner)</p>
        </div>
        """
        folium.Marker(
            [p["lat"], p["lng"]],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=p["name"],
            icon=folium.Icon(icon="building", prefix="fa", color="blue")
        ).add_to(marker_cluster)
    
    # Spara till temporär fil om filnamn anges
    if outfile:
        m.save(outfile)
        return outfile
    
    # Returnera HTML-koden för kartan som en sträng
    return m._repr_html_()

def generate_competitor_map(competitors, city, max_results=10):
    """
    Genererar en karta för konkurrenter baserat på namnen och staden.
    
    Args:
        competitors: Lista med dictionaries som innehåller 'name' och 'description'
        city: Staden där konkurrenterna finns
        max_results: Maximalt antal resultat att visa
    
    Returns:
        HTML för kartan som kan visas i Streamlit
    """
    all_places = []
    
    # Sök efter varje konkurrent
    for comp in competitors:
        comp_name = comp.get("name", "")
        if comp_name and comp_name != "Ditt företag" and comp_name != "Övriga":
            query = f"{comp_name} in {city}"
            places = text_search(query, max_results=2)  # Begränsa till 2 resultat per konkurrent
            
            # Lägg till marknadsandel till varje konkurrent
            for place in places:
                place["market_share"] = comp.get("share", "N/A")
                place["description"] = comp.get("description", "")
            
            all_places.extend(places)
    
    # Skapa temporär fil för kartan
    with tempfile.NamedTemporaryFile(delete=False, suffix='.html') as temp_file:
        temp_path = temp_file.name
    
    # Skapa och spara karta
    make_map(all_places, city=city, outfile=temp_path)
    
    # Läs in HTML från temporär fil
    with open(temp_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Ta bort temporär fil
    os.remove(temp_path)
    
    return html_content

if __name__ == "__main__":
    query = "electronics stores in Stockholm"
    results = text_search(query, max_results=10)
    
    # Skriv resultat i terminalen
    for i, p in enumerate(results, 1):
        print(
            textwrap.dedent(
                f"""
                {i}. {p['name']}
                   Adress : {p['address']}
                   Betyg  : {p['rating']} ({p['reviews']} reviews)
                """
            ).strip(),
            end="\n\n",
        )
    
    # Skapa karta och öppna den direkt
    html_file = make_map(results, outfile="results_map.html")
    webbrowser.open_new_tab(html_file)
