import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCurrentLocation = () => {
    navigate('/dashboard', { state: { requestLocation: true } });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="card home-card" style={{ width: '100%', maxWidth: '1200px', padding: '80px 40px', alignItems: 'center' }}>
        {/* Header with Search and Location */}
        <header className="header" style={{ flexDirection: 'column', alignItems: 'center', margin: 0, width: '100%' }}>
          <div className="logo" style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', margin: 0 }}>TP 40<br />UV Index</h1>
            <p style={{ color: 'var(--text-secondary, #444)', marginTop: '15px', fontWeight: '600', fontSize: '18px' }}>Check the UV index and weather in your city</p>
          </div>
          
          <div className="search-container" style={{ width: '100%', maxWidth: '600px', marginBottom: '30px' }}>
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
      </div>
    </div>
  );
};

export default Home;
