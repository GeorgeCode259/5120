import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface WeatherData {
  name: string;
  current: {
    uv: number;
    temp: number;
    sunrise: number;
    sunset: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
  };
  hourly: Array<{
    dt: number;
    temp: number;
    uvi: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchWeather = React.useCallback(async (lat?: number, lon?: number, q?: string) => {
    try {
      setLoading(true);
      let url = '/weather/uv';
      if (q) {
        url = `/weather/uv?q=${encodeURIComponent(q)}`;
      } else if (lat !== undefined && lon !== undefined) {
        url = `/weather/uv?lat=${lat}&lon=${lon}`;
      }
      const response = await api.get(url);
      setWeatherData(response.data);
      setLoading(false);
    } catch (err: unknown) {
      console.error('Error fetching weather:', err);
      let errorMessage = 'Failed to fetch weather data.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { error?: string } } };
        errorMessage = axiosError.response?.data?.error || errorMessage;
      }
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 初始加载时，loading 已经是 true，所以我们只需要触发异步获取
    const initFetch = async () => {
      await fetchWeather();
    };
    initFetch();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update time every minute

    return () => clearInterval(timer);
  }, [fetchWeather]);

  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWeather(undefined, undefined, searchQuery.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getUVStatus = (uv: number) => {
    if (uv < 3) return 'Low';
    if (uv < 6) return 'Moderate';
    if (uv < 8) return 'High';
    if (uv < 11) return 'Very high';
    return 'Extreme';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (loading) return <div>Loading weather data...</div>;
  if (error) return <div>{error}</div>;
  if (!weatherData) return <div>No weather data available.</div>;

  const { current } = weatherData;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>TP 40<br />UV Index</h1>
        </div>
        
        <div className="search-container">
          <span className="search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for your preferred city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button className="location-btn" onClick={handleCurrentLocation}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Current Location
        </button>
      </header>
      
      {/* Optional: Simple Auth Links */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '15px' }}>
        <Link to="/login" style={{ color: '#666', fontSize: '12px', textDecoration: 'none' }}>Login</Link>
        <Link to="/register" style={{ color: '#666', fontSize: '12px', textDecoration: 'none' }}>Register</Link>
      </div>


      {/* Main Grid */}
      <main className="dashboard-grid">
        {/* City Card */}
        <section className="card city-card">
          <h2 className="city-name">{weatherData.name}</h2>
          <div className="time">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
          <div className="date">{currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </section>

        {/* UV & Weather Card */}
        <section className="card uv-card">
          <div className="uv-index-section">
            <div className="uv-value">UV {Math.round(current.uv)}</div>
            <div className="uv-label">{getUVStatus(current.uv)}</div>
            <div className="sun-times">
              <div className="sun-item">
                <span className="sun-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M12 7v5l3 3" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                <div>
                  <div>Sunrise</div>
                  <div>{formatTime(current.sunrise)}</div>
                </div>
              </div>
              <div className="sun-item">
                <span className="sun-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M12 7v5l3 3" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                <div>
                  <div>Sunset</div>
                  <div>{formatTime(current.sunset)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="weather-section">
            <div className="weather-icon">
              <img src={`https://openweathermap.org/img/wn/${current.weather.icon}@2x.png`} alt={current.weather.main} />
            </div>
            <div className="weather-desc">{current.weather.main}</div>
          </div>

          <div className="protection-section">
            {current.uv < 3 ? (
              <>
                <div className="warning low-uv">
                  <span className="warning-icon">✅</span>
                  <div>Low UV Levels</div>
                </div>
                <div className="protection-info-text">
                  Protection is generally not required unless outdoors for extended periods.
                </div>
              </>
            ) : current.uv < 8 ? (
              <>
                <div className="warning">
                  <span className="warning-icon">⚠️</span>
                  <div>Sun protection strongly recommendation.</div>
                </div>
                <div className="protection-info">
                  <div className="info-item">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 12h20M2 12l2 2m-2-2l2-2" />
                      <path d="M12 2v20" />
                    </svg>
                    <div className="info-label">SPF 50+</div>
                    <div className="small">water-resistant</div>
                  </div>
                  <div className="info-item">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    <div className="info-label">2 hours</div>
                    <div className="small">Reapply</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="warning extreme-uv">
                  <span className="warning-icon">🚨</span>
                  <div>Extreme UV Risk</div>
                </div>
                <div className="dosage-breakdown">
                  <div className="dosage-title">Sunscreen Dosage (ml):</div>
                  <div className="dosage-grid">
                    <div className="dosage-item"><span>Face & Neck</span> <span>5ml</span></div>
                    <div className="dosage-item"><span>Each Arm</span> <span>5ml</span></div>
                    <div className="dosage-item"><span>Each Leg</span> <span>10ml</span></div>
                    <div className="dosage-item"><span>Torso</span> <span>10ml</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Recommendation Card */}
        <section className="card recommendation-card">
          <h3 className="recommendation-title">Cloth Recommendation</h3>
          <div className="recommendation-list">
            <div className="rec-item">
              <div className="rec-icon-box">👕</div>
              <div>on sun protective clothing</div>
            </div>
            <div className="rec-item">
              <div className="rec-icon-box">👒</div>
              <div>on a sun protective hat</div>
            </div>
            <div className="rec-item">
              <div className="rec-icon-box">🕶️</div>
              <div>on sunglasses</div>
            </div>
          </div>
        </section>

        {/* Forecast Card */}
        <section className="card forecast-card">
          <h3 className="forecast-title">Hourly Forecast:</h3>
          <div className="forecast-items">
            {weatherData.hourly.map((hour, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-time">{formatTime(hour.dt)}</div>
                <img 
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
                  alt={hour.weather[0].main} 
                  className="forecast-icon"
                />
                <div className="forecast-temp">{Math.round(hour.temp)}°C</div>
                <div className="forecast-uv">UV {Math.round(hour.uvi)}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
