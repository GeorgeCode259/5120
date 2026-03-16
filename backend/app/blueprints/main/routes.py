import os
import requests
from flask import jsonify, current_app, request

from ...models import Product, CancerIncidence
from ...extensions import limiter
from ...utils.validation import validate_input
from . import bp


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
            "name": weather_data["name"],
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

