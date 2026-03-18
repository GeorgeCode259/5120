import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeather } from '../context/useWeather';
import { getUVProtectionAdvice } from '../utils/uvAdvice';

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
    const name = searchParams.get('name');

    // If we are waiting for location from Home page, don't fetch default weather
    if (location.state?.requestLocation && !lat && !lon) {
      return;
    }

    if (q) {
      // Use the query as the name if direct search
      const displayName = q.charAt(0).toUpperCase() + q.slice(1);
      fetchWeather(undefined, undefined, q, displayName);
    } else if (lat && lon) {
      fetchWeather(lat, lon, undefined, name || undefined);
    } else {
      // Fetch default weather (Melbourne) when navigating to /dashboard without params.
      // If already cached, WeatherContext will return it instantly without loading.
      fetchWeather();
    }
  }, [location.search, fetchWeather, location.state]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getUVColorClass = (uv: number) => {
    if (uv < 3) return 'uv-low';
    if (uv < 6) return 'uv-moderate';
    if (uv < 8) return 'uv-high';
    if (uv < 11) return 'uv-very-high';
    return 'uv-extreme';
  };

  const formatTime = (timestamp: number) => {
    const offset = weatherData.current.timezone;
    const date = new Date((timestamp + offset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' });
  };


  if (error) return <div className="dashboard-container">Error: {error}</div>;

  const { current } = weatherData;
  const isDataReady = weatherData.name !== '--';
  const showLoading = loading || !isDataReady;
  const uvAdvice = getUVProtectionAdvice(current.uv);
  
  const localTime = new Date(currentTime.getTime() + current.timezone * 1000);

  return (
    <div className="dashboard-wrapper" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
      {showLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
      )}
      <div className="dashboard-container" style={{ flex: 1, width: '100%' }}>
        {/* Main Grid - Only show if we have data (even if loading new data, we can show old data behind overlay) */}
        {isDataReady && (
        <main className="dashboard-grid">
        {/* City Card */}
        <section className="card city-card">
          <h2 className="city-name">{weatherData.name}</h2>
          <div className="time">{localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' })}</div>
          <div className="date">{localTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}</div>
        </section>

        {/* UV & Weather Card */}
        <section className="card uv-card">
          <div className={`uv-index-section ${getUVColorClass(current.uv)}`}>
            <div className="uv-value">UV {Math.round(current.uv)}</div>
            <div className="uv-label">{uvAdvice.protectionLevel}</div>
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
            {uvAdvice.protectionLevel === 'Low' ? (
              <>
                <div className="warning low-uv">
                  <span className="warning-icon">✅</span>
                  <div>Low UV Levels</div>
                </div>
                <div className="protection-info-text">
                  {uvAdvice.clothingAdvice.summary}
                </div>
              </>
            ) : (
              <>
                <div className={`warning ${['Very High', 'Extreme'].includes(uvAdvice.protectionLevel) ? 'extreme-uv' : ''}`}>
                  <span className="warning-icon">{['Very High', 'Extreme'].includes(uvAdvice.protectionLevel) ? '🚨' : '⚠️'}</span>
                  <div>{uvAdvice.protectionLevel} Protection Required</div>
                </div>
                
                {uvAdvice.sunscreenAdvice && (
                  <>
                    <div className="protection-info">
                      <div className="info-item">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 12h20M2 12l2 2m-2-2l2-2" />
                          <path d="M12 2v20" />
                        </svg>
                        <div className="info-label">SPF {uvAdvice.sunscreenAdvice.spf}</div>
                        <div className="small">water-resistant</div>
                      </div>
                      <div className="info-item">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <div className="info-label">{uvAdvice.sunscreenAdvice.reapplication}</div>
                        <div className="small">Reapply</div>
                      </div>
                    </div>

                    <div className="dosage-breakdown">
                      <div className="dosage-title">Sunscreen Dosage (SPF {uvAdvice.sunscreenAdvice.spf}):</div>
                      <div className="dosage-grid">
                        <div className="dosage-item"><span>Face & Neck</span> <span>{uvAdvice.sunscreenAdvice.dosage.faceNeck}</span></div>
                        <div className="dosage-item"><span>Arms</span> <span>{uvAdvice.sunscreenAdvice.dosage.arms}</span></div>
                        <div className="dosage-item"><span>Legs</span> <span>{uvAdvice.sunscreenAdvice.dosage.legs}</span></div>
                        <div className="dosage-item"><span>Torso</span> <span>{uvAdvice.sunscreenAdvice.dosage.torso}</span></div>
                      </div>
                      {uvAdvice.sunscreenAdvice.scenarios.length > 0 && (
                        <div className="scenarios" style={{marginTop: '10px', fontSize: '0.8rem', color: '#666'}}>
                          Recommended for: {uvAdvice.sunscreenAdvice.scenarios.join(', ')}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Recommendation Card */}
        <section className="card recommendation-card">
          <h3 className="recommendation-title">
            Cloth Recommendation 
            <span style={{fontSize: '0.8em', fontWeight: 'normal', color: '#666', marginLeft: '10px'}}>
              ({uvAdvice.dataSource})
            </span>
          </h3>
          <div className="recommendation-list">
            {uvAdvice.clothingAdvice.items.map((item, index) => (
              <div key={index} className="rec-item">
                <div className="rec-icon-box">{item.icon}</div>
                <div className="rec-text-content">
                  <div className="rec-main-text">
                    {item.text}
                    {item.intensity && (
                      <span className="intensity-tag" style={{
                        fontSize: '0.7em', 
                        marginLeft: '8px', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        background: item.intensity === 'Professional' ? '#ffeb3b' : '#eee',
                        color: '#333'
                      }}>
                        {item.intensity}
                      </span>
                    )}
                  </div>
                  <div className="rec-desc-text">{item.desc}</div>
                  {item.specs && (
                    <div className="rec-specs" style={{fontSize: '0.75rem', color: '#888', marginTop: '2px'}}>
                       {Object.entries(item.specs).map(([key, val]) => `${key}: ${val}`).join(' • ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
