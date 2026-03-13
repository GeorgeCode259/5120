import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigate(`/dashboard?lat=${latitude}&lon=${longitude}`);
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
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header with Search and Location */}
      <header className="header" style={{ flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <div className="logo" style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px' }}>TP 40<br />UV Index</h1>
          <p style={{ color: '#666', marginTop: '10px' }}>Check the UV index and weather in your city</p>
        </div>
        
        <div className="search-container" style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
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
  );
};

export default Home;
