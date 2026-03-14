import React from 'react';

const UVAwareness: React.FC = () => {
  return (
    <div className="uv-awareness-container">
      <h1>UV Awareness & Skin Health</h1>

      <div className="awareness-grid">
        {/* Skin Cancer Statistics Card */}
        <div className="awareness-card">
          <h2>Skin Cancer Statistics</h2>
          <p>Australia has one of the highest rates of skin cancer in the world.</p>
          
          <div className="chart-visual">
            <div className="bar-chart">
              <div className="bar-item">
                <span className="bar-label">Melanoma</span>
                <div className="bar-track">
                  <div className="bar-fill high" style={{ width: '80%' }}>High Risk</div>
                </div>
              </div>
              <div className="bar-item">
                <span className="bar-label">BCC</span>
                <div className="bar-track">
                  <div className="bar-fill medium" style={{ width: '60%' }}>Common</div>
                </div>
              </div>
              <div className="bar-item">
                <span className="bar-label">SCC</span>
                <div className="bar-track">
                  <div className="bar-fill medium" style={{ width: '45%' }}>Common</div>
                </div>
              </div>
            </div>
          </div>
          <p className="protection-info-text">
            2 in 3 Australians will be diagnosed with skin cancer by the age of 70.
          </p>
        </div>

        {/* UV Impact Card */}
        <div className="awareness-card">
          <h2>Impact of UV Exposure</h2>
          <div className="impact-list">
            <div className="impact-item short-term">
              <h3>Short Term</h3>
              <p>Sunburn, tanning (skin damage), and eye damage like photokeratitis.</p>
            </div>
            <div className="impact-item long-term">
              <h3>Long Term</h3>
              <p>Premature aging (wrinkles, leathery skin), eye cataracts, and increased risk of skin cancer.</p>
            </div>
          </div>
        </div>

        {/* Interactive Risk Visual */}
        <div className="awareness-card" style={{ gridColumn: '1 / -1' }}>
          <h2>UV Index Risk Levels</h2>
          <p>Hover over the bars to see protection requirements.</p>
          
          <div className="risk-visual">
            {[
              { level: '1-2', height: '20%', color: '#4caf50', risk: 'Low', advice: 'No protection required.' },
              { level: '3-5', height: '40%', color: '#ffeb3b', risk: 'Moderate', advice: 'Sun protection recommended.' },
              { level: '6-7', height: '60%', color: '#ff9800', risk: 'High', advice: 'Protection essential.' },
              { level: '8-10', height: '80%', color: '#f44336', risk: 'Very High', advice: 'Extra protection needed.' },
              { level: '11+', height: '100%', color: '#9c27b0', risk: 'Extreme', advice: 'Avoid sun, full protection.' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="risk-column" 
                style={{ height: item.height, backgroundColor: item.color }}
              >
                <div className="tooltip">
                  <strong>{item.risk}</strong><br/>
                  {item.advice}
                </div>
                <span className="label">UV {item.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UVAwareness;
