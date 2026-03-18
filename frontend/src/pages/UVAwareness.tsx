import React from 'react';
import SkinCancerChart from '../components/SkinCancerChart';
import UvIndexChart from '../components/UvIndexChart';
import FlipCard from '../components/FlipCard';

const UVAwareness: React.FC = () => {
  return (
    <div className="uv-awareness-container">
      <h1>UV Awareness & Skin Health</h1>
      
      <div className="awareness-grid">
        {/* Section 1: Myths & Facts */}
        <div className="awareness-card">
          <h2>Think you know the facts?</h2>
          <p>Tap each card to reveal the truth.</p>
          
          <div className="myths-section" style={{ marginTop: '20px' }}>
            <div className="cards-container">
              <FlipCard 
                myth="You don't need sunscreen on cloudy days."
                fact="Up to 80% of UV radiation passes through clouds. You can burn on a cool, overcast day — always check the UV index, not the weather."
              />
              <FlipCard 
                myth="UV radiation only matters in summer."
                fact="In most of Australia, UV reaches 3 or above year-round. In QLD and NT, sun protection is needed every single day of the year."
              />
            </div>
            <p className="source-text">Source: Cancer Council Australia / WHO INTERSUN Programme.</p>
          </div>
        </div>

        {/* Divider 1 */}
        <div className="section-divider">
          <h2>Across Australia, UV levels are consistently high.</h2>
        </div>

        {/* Section 2: UV Index Trend */}
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

        {/* Divider 2 */}
        <div className="section-divider">
          <h2>And the impact on skin health is real.</h2>
        </div>

        {/* Section 3: Cancer Chart */}
        <div className="awareness-card">
          <h2>Melanoma Incidence Trends</h2>
          <div className="chart-visual" style={{ marginTop: '20px' }}>
            <SkinCancerChart />
          </div>
          <p className="protection-info-text">
            UV exposure has a direct impact on skin health. Explore how melanoma rates have changed across Australia over time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UVAwareness;
