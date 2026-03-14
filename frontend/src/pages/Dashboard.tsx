import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeather } from '../context/useWeather';

const Dashboard: React.FC = () => {
  const { weatherData, loading, error, fetchWeather } = useWeather();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.requestLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            navigate(`/dashboard?lat=${latitude}&lon=${longitude}`, { replace: true });
          },
          (error) => {
            console.error("Error getting location:", error);
            alert("Could not get your current location.");
            navigate('/dashboard', { replace: true });
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    // If we are waiting for location from Home page, don't fetch default weather
    if (location.state?.requestLocation && !lat && !lon) {
      return;
    }

    if (q) {
      fetchWeather(undefined, undefined, q);
    } else if (lat && lon) {
      fetchWeather(lat, lon);
    } else {
      fetchWeather();
    }
  }, [location.search, fetchWeather, location.state]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

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

  const getClothingRecommendations = (uv: number) => {
    if (uv < 3) {
      return [
        {
          icon: "🕶️",
          text: "Wear sunglasses",
          desc: "Wear sunglasses on bright days."
        }
      ];
    }
    if (uv < 6) {
      return [
        {
          icon: "👕",
          text: "Cover up",
          desc: "Wear a T-shirt or shirt."
        },
        {
          icon: "👒",
          text: "Wear a hat",
          desc: "Wear a wide-brimmed hat."
        },
        {
          icon: "🕶️",
          text: "Wear sunglasses",
          desc: "Protect your eyes."
        }
      ];
    }
    if (uv < 8) {
      return [
        {
          icon: "👕",
          text: "Protection required",
          desc: "Wear sun-protective clothing covering as much skin as possible."
        },
        {
          icon: "👒",
          text: "Wear a hat",
          desc: "Wear a hat that shades face, neck and ears."
        },
        {
          icon: "🕶️",
          text: "Wear sunglasses",
          desc: "Wrap-around sunglasses are best."
        }
      ];
    }
    return [
      {
        icon: "☂️",
        text: "Seek shade",
        desc: "Seek shade, especially during midday hours."
      },
      {
        icon: "👕",
        text: "Protective clothing",
        desc: "Wear loose, long-sleeved shirt and trousers."
      },
      {
        icon: "👒",
        text: "Wear a hat",
        desc: "Wear a broad-brimmed hat."
      },
      {
        icon: "🕶️",
        text: "Wear sunglasses",
        desc: "Wear quality sunglasses."
      }
    ];
  };

  if (error) return <div className="dashboard-container">Error: {error}</div>;

  const { current } = weatherData;
  const isDataReady = weatherData.name !== '--';
  const showLoading = loading || !isDataReady;
  const recommendations = getClothingRecommendations(current.uv);

  return (
    <div className="dashboard-container">
      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
      )}
      {/* Main Grid - Only show if we have data (even if loading new data, we can show old data behind overlay) */}
      {isDataReady && (
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
            {recommendations.map((item, index) => (
              <div key={index} className="rec-item">
                <div className="rec-icon-box">{item.icon}</div>
                <div className="rec-text-content">
                  <div className="rec-main-text">{item.text}</div>
                  <div className="rec-desc-text">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      )}
    </div>
  );
};

export default Dashboard;
