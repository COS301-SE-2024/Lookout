import React, { useState } from 'react';
import '../assets/styles/legend.css';

const Legend = ({ items }: { items: Array<{ icon: string; name: string }> }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleLegend = () => {
    setIsExpanded(!isExpanded);
  };

  return (

    <div className="legend bg-nav hover:bg-white hover:text-navBkg">
      <h3 onClick={toggleLegend} style={{ cursor: 'pointer' }}>
        Legend {isExpanded ? '▲' : '▼'}
      </h3>
      {isExpanded && (
        <div className="legend-items">
          {items.map((item, index) => (
            <div key={index} className="legend-item">
              <img src={item.icon} alt={item.name} className="legend-icon" />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Legend;
