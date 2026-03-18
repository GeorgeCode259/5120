import React, { useState } from 'react';

interface FlipCardProps {
  myth: string;
  fact: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ myth, fact }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Front - Myth */}
        <div className="flip-card-front">
          <div className="card-tag myth-tag">Myth</div>
          <p className="card-text">"{myth}"</p>
          <div className="card-hint">Tap to reveal the fact &rarr;</div>
        </div>
        
        {/* Back - Fact */}
        <div className="flip-card-back">
          <div className="card-tag fact-tag">Fact</div>
          <p className="card-text">{fact}</p>
          <div className="card-hint">&larr; Tap to flip back</div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
