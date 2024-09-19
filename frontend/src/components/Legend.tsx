import React from 'react';
import '../assets/styles/legend.css';
const Legend = ({ items }: { items: Array<{ icon: string; name: string }> }) => {
  return (
    <div className="legend bg-nav">
      <h3>Legend</h3>
      {items.map((item, index) => (
        <div key={index} className="legend-item bg-nav">
          <img src={item.icon} alt={item.name} className="legend-icon bg-nav" />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
