import os
import requests
from flask import jsonify, current_app, request
from functools import lru_cache

from ...models import Product, CancerIncidence
from ...extensions import limiter
from ...utils.validation import validate_input
from . import bp


@lru_cache(maxsize=1024)
def fetch_location_from_nominatim(query: str):
    """
    Fetch location data from OpenStreetMap Nominatim API.
    Cached to handle high concurrency and ensure response < 500ms for frequent queries.
    """
    # Accept-Language helps with multi-language input support
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "countrycodes": "au",
        "format": "json",
        "addressdetails": 1,
        "limit": 5
    }
    headers = {
        "User-Agent": "SunSafety-App/1.0 (Student Project)",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7"
    }
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Geocoding error: {e}")
        return None

@bp.get("/location/search")
@limiter.limit("20 per minute")
def search_location():
    """
    Intelligent Australian Place Name Recognition and Geolocation System
    - Supports fuzzy matching and aliases.
    - Returns structured geographic data: full address, admin hierarchy, coordinates, bounding box.
    """
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    data = fetch_location_from_nominatim(q)
    
    if data is None:
        return jsonify({"error": "Failed to fetch location data"}), 500
        
    if not data:
        return jsonify([]), 200

    results = []
    for item in data:
        address = item.get("address", {})
        
        # Parse administrative hierarchy
        state = address.get("state", "")
        city = address.get("city", address.get("town", address.get("village", address.get("county", ""))))
        suburb = address.get("suburb", address.get("neighbourhood", ""))
        street = address.get("road", "")
        postcode = address.get("postcode", "")
        
        results.append({
            "place_id": item.get("place_id"),
            "full_address": item.get("display_name"),
            "administrative_units": {
                "state": state,
                "city": city,
                "suburb": suburb,
                "street": street,
                "postcode": postcode
            },
            "coordinates": {
                "lat": float(item.get("lat")),
                "lon": float(item.get("lon"))
            },
            "bounding_box": item.get("boundingbox") # [latMin, latMax, lonMin, lonMax]
        })

    return jsonify(results)


@bp.get("/cancer-incidence")
def get_cancer_incidence():
    # Fetch all records from the database
    # Ordering by cancer_type and year to match previous JSON structure logic if needed
    records = CancerIncidence.query.order_by(CancerIncidence.cancer_type, CancerIncidence.year).all()
    return jsonify([record.to_dict() for record in records])


@bp.get("/weather/uv")
@limiter.limit("50 per second")
@validate_input
def get_weather_uv():
    api_key = current_app.config.get("OPENWEATHER_API_KEY")
    if not api_key:
        return jsonify({"error": "OpenWeather API Key not configured"}), 500
    
    q = request.args.get('q')
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    override_name = request.args.get('name')

    if q:
        # If city name is provided, get coordinates first
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={q}&limit=1&appid={api_key}"
        try:
            geo_res = requests.get(geo_url)
            if geo_res.status_code == 200 and geo_res.json():
                location = geo_res.json()[0]
                lat = location['lat']
                lon = location['lon']
            else:
                return jsonify({"error": "City not found"}), 404
        except requests.exceptions.RequestException as e:
            return jsonify({"error": f"Geocoding error: {str(e)}"}), 500
    
    # Fallback to defaults if neither q nor lat/lon are provided
    if lat is None or lon is None:
        lat = -37.9150
        lon = 145.1290
    
    # Using Current Weather API which is available to all API keys
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    
    # Using Open-Meteo for Real-time UV Index (OpenWeatherMap /uvi often returns daily max)
    uv_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=uv_index"
    
    try:
        # Get current weather
        weather_res = requests.get(url)
        if weather_res.status_code != 200:
            return jsonify({"error": "Weather API Error", "details": weather_res.json()}), weather_res.status_code
        weather_data = weather_res.json()

        # Get UV index
        uv_res = requests.get(uv_url)
        uv_value = 0
        if uv_res.status_code == 200:
            uv_data = uv_res.json()
            if 'current' in uv_data and 'uv_index' in uv_data['current']:
                uv_value = uv_data['current']['uv_index']
        
        return jsonify({
            "name": override_name if override_name else weather_data["name"],
            "current": {
                "uv": uv_value,
                "temp": weather_data["main"]["temp"],
                "sunrise": weather_data["sys"]["sunrise"],
                "sunset": weather_data["sys"]["sunset"],
                "weather": weather_data["weather"][0],
                "timezone": weather_data.get("timezone", 0)
            },
            "hourly": []  # Current Weather API doesn't provide hourly forecast
        })
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@bp.get("/")
def home():
    latest_products = Product.query.order_by(Product.created_at.desc()).limit(6).all()
    return jsonify([product.to_dict() for product in latest_products])


@bp.get("/about")
def about():
    return jsonify({"msg": "Welcome to Sunscreen Review API"})

