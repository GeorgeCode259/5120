import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationSearch, type LocationResult } from '../hooks/useLocationSearch';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { results, loading, error, searchLocations, clearResults } = useLocationSearch();
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCurrentLocation = () => {
    navigate('/dashboard', { state: { requestLocation: true } });
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      setShowDropdown(true);
      searchLocations(val);
    } else {
      setShowDropdown(false);
      clearResults();
    }
  };

  const handleSelectLocation = (loc: LocationResult) => {
    setSearchQuery(loc.full_address);
    setShowDropdown(false);
    // Prefer suburb, then city, then fallback to first part of full address
    const locationName = loc.administrative_units.suburb || loc.administrative_units.city || loc.full_address.split(',')[0];
    navigate(`/dashboard?lat=${loc.coordinates.lat}&lon=${loc.coordinates.lon}&name=${encodeURIComponent(locationName)}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowDropdown(false);
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
          
          <div className="search-container" ref={searchContainerRef} style={{ width: '100%', maxWidth: '600px', marginBottom: '30px', position: 'relative' }}>
            <span className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for any Australian place (suburb, street, city)..." 
              value={searchQuery}
              onChange={handleSearchInput}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
            />
            
            {/* Autocomplete Dropdown */}
            {showDropdown && (searchQuery.trim().length > 0) && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginTop: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {loading && <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>Searching...</div>}
                {error && <div style={{ padding: '15px', textAlign: 'center', color: 'red' }}>{error}</div>}
                {!loading && !error && results.length === 0 && <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>No locations found</div>}
                
                {!loading && !error && results.map((loc) => (
                  <div 
                    key={loc.place_id}
                    onClick={() => handleSelectLocation(loc)}
                    style={{
                      padding: '12px 15px',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', marginBottom: '4px' }}>
                      {loc.administrative_units.street ? `${loc.administrative_units.street}, ` : ''}
                      {loc.administrative_units.suburb || loc.administrative_units.city}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {loc.full_address}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
