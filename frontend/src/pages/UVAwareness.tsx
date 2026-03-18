import React from 'react';
import SkinCancerChart from '../components/SkinCancerChart';
import UvIndexChart from '../components/UvIndexChart';

const UVAwareness: React.FC = () => {
  return (
    <div className="uv-awareness-container">
      <h1>UV Awareness & Skin Health</h1>

      <div className="awareness-grid">
        {/* UV Index Chart (Chart 2) */}
        <div className="awareness-card">
          <h2>UV Index Monthly Variation (2021)</h2>
          <p>Monthly average peak UV index across major Australian cities.</p>
          
          <div className="chart-visual">
            <UvIndexChart />
          </div>
          <p className="protection-info-text">
            UV levels are generally highest in summer (Dec-Feb) and lowest in winter (Jun-Aug). Northern cities like Darwin maintain high UV levels year-round.
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

        {/* Melanoma Trend Chart (Chart 1) */}
        <div className="awareness-card" style={{ gridColumn: '1 / -1' }}>
          <h2>Melanoma Incidence Trends</h2>
          <div className="chart-visual" style={{ marginTop: '20px' }}>
            <SkinCancerChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UVAwareness;
