import requests
from flask import jsonify, current_app, request
from functools import lru_cache

from ...models import Product, CancerIncidence
from ...extensions import limiter
from ...utils.validation import validate_input
from . import bp


@lru_cache(maxsize=1024)
def fetch_location_from_photon(query: str):
    """
    Fetch location data from Photon API (based on OpenStreetMap).
    Photon supports partial word matching (autocomplete/prefix search) which Nominatim lacks.
    Cached to handle high concurrency and ensure response < 500ms for frequent queries.
    """
    url = "https://photon.komoot.io/api/"
    params = {
        "q": query,
        "limit": 15, # Fetch more to allow for custom sorting and filtering
        "bbox": "112.9,-43.6,153.6,-10.6" # Bounding box for Australia
    }
    headers = {
        "User-Agent": "SunSafety-App/1.0 (Student Project)"
    }
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        # Double check countrycode just in case bbox catches some nearby islands
        au_results = []
        for feature in data.get("features", []):
            props = feature.get("properties", {})
            if props.get("countrycode") == "AU":
                au_results.append(feature)
                
        # Custom sorting logic to prioritize exact matches and actual places
        def get_score(feature):
            props = feature.get("properties", {})
            name = props.get("name", "").lower()
            q = query.lower()
            
            score = 0
            # Name match scoring
            if name == q:
                score += 100
            elif name.startswith(q):
                score += 80
            elif q in name:
                score += 50
            else:
                score += 10
                
            # Place type scoring (prefer cities, suburbs over buildings)
            osm_key = props.get("osm_key", "")
            osm_value = props.get("osm_value", "")
            
            if osm_key == "place":
                if osm_value in ["city", "town", "suburb", "neighbourhood", "village", "state"]:
                    score += 20
                else:
                    score += 10
            elif osm_key in ["leisure", "building", "amenity", "office"]:
                score -= 5
                
            return score
            
        au_results.sort(key=get_score, reverse=True)
                
        return au_results[:5] # Return top 5 best matches
    except Exception as e:
        print(f"Geocoding error: {e}")
        return None

@bp.get("/location/search")
@limiter.limit("20 per minute")
def search_location():
    """
    Intelligent Australian Place Name Recognition and Geolocation System
    - Supports prefix matching and autocomplete via Photon API.
    - Returns structured geographic data: full address, admin hierarchy, coordinates, bounding box.
    """
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    data = fetch_location_from_photon(q)
    
    if data is None:
        return jsonify({"error": "Failed to fetch location data"}), 500
        
    if not data:
        return jsonify([]), 200

    results = []
    for item in data:
        props = item.get("properties", {})
        coords = item.get("geometry", {}).get("coordinates", [0, 0])
        
        # Parse administrative hierarchy
        state = props.get("state", "")
        city = props.get("city", props.get("county", ""))
        suburb = props.get("district", props.get("locality", ""))
        street = props.get("street", "")
        postcode = props.get("postcode", "")
        
        # Build a display name similar to Nominatim
        address_parts = [props.get("name")]
        if street: address_parts.append(street)
        if suburb: address_parts.append(suburb)
        if city: address_parts.append(city)
        if state: address_parts.append(state)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_parts = []
        for p in address_parts:
            if p and p not in seen:
                seen.add(p)
                unique_parts.append(p)
                
        full_address = ", ".join(unique_parts)
        
        # Photon extent format: [minLon, minLat, maxLon, maxLat]
        # Our app expects boundingbox like Nominatim: [latMin, latMax, lonMin, lonMax]
        extent = props.get("extent")
        if extent and len(extent) == 4:
            bounding_box = [str(extent[1]), str(extent[3]), str(extent[0]), str(extent[2])]
        else:
            bounding_box = None
            
        results.append({
            "place_id": str(props.get("osm_id", "")),
            "full_address": full_address,
            "administrative_units": {
                "state": state,
                "city": city,
                "suburb": suburb,
                "street": street,
                "postcode": postcode
            },
            "coordinates": {
                "lat": float(coords[1]), # Photon returns [lon, lat]
                "lon": float(coords[0])
            },
            "bounding_box": bounding_box
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

