import os
import requests
from flask import jsonify, current_app, request

from ...models import Product
from . import bp


@bp.get("/weather/uv")
def get_weather_uv():
    api_key = current_app.config.get("OPENWEATHER_API_KEY")
    if not api_key:
        return jsonify({"error": "OpenWeather API Key not configured"}), 500
    
    lat = request.args.get('lat', -37.9150, type=float)
    lon = request.args.get('lon', 145.1290, type=float)
    
    # Using Current Weather API which is available to all API keys
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    
    # We also need UV index, which is sometimes a separate call in 2.5
    uv_url = f"https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={api_key}"
    
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
            uv_value = uv_res.json().get('value', 0)
        
        return jsonify({
            "name": weather_data["name"],
            "current": {
                "uv": uv_value,
                "temp": weather_data["main"]["temp"],
                "sunrise": weather_data["sys"]["sunrise"],
                "sunset": weather_data["sys"]["sunset"],
                "weather": weather_data["weather"][0]
            },
            "hourly": [] # Current Weather API doesn't provide hourly forecast
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

