import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
          />
        </div>

        <button className="location-btn">
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
          <h2 className="city-name">Clayton</h2>
          <div className="time">12:00 PM</div>
          <div className="date">Monday, 9 March</div>
        </section>

        {/* UV & Weather Card */}
        <section className="card uv-card">
          <div className="uv-index-section">
            <div className="uv-value">UV 8</div>
            <div className="uv-label">Very high</div>
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
                  <div>06:37 AM</div>
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
                  <div>20:37 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="weather-section">
            <div className="weather-icon">
              <svg viewBox="0 0 64 64" width="120" height="120">
                <circle cx="32" cy="32" r="12" fill="#FFD700" />
                <path d="M32 10v4M32 50v4M10 32h4M50 32h4M16.5 16.5l2.8 2.8M44.7 44.7l2.8 2.8M16.5 47.5l2.8-2.8M44.7 19.3l2.8-2.8" stroke="#FFD700" strokeWidth="3" />
                <path d="M45 45c0-5.5-4.5-10-10-10-1.5 0-3 .3-4.3 1-2-3-5.3-5-9.2-5-6.1 0-11 4.9-11 11 0 .3 0 .7.1 1h34.4z" fill="#E1F5FE" />
              </svg>
            </div>
            <div className="weather-desc">Cloudy</div>
          </div>

          <div className="protection-section">
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
          <div className="forecast-graph">
            <div className="graph-placeholder">
              {/* Replace with a real chart component later */}
              <svg viewBox="0 0 800 300" width="100%" height="100%" preserveAspectRatio="none">
                <path d="M0,250 Q200,50 400,150 T800,200" fill="none" stroke="#000" strokeWidth="3" />
                <rect x="390" y="140" width="20" height="20" fill="red" opacity="0.5" />
                <text x="400" y="130" textAnchor="middle" fontSize="12" fontWeight="bold">1:00 pm 8.5 Very High</text>
                <line x1="400" y1="0" x2="400" y2="300" stroke="blue" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
