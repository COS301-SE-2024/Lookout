import React from 'react';
import '../assets/styles/legend.css';
const Legend = ({ items }: { items: Array<{ icon: string; name: string }> }) => {
  return (
    <div className="legend">
      <h3>Legend</h3>
      {items.map((item, index) => (
        <div key={index} className="legend-item">
          <img src={item.icon} alt={item.name} className="legend-icon" />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
