import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          className="absolute top-full w-max mt-0 bg-iconShadow text-icon text-xs rounded px-2 shadow-lg"
          style={{ left: '50%', transform: 'translateX(-50%)' }} // Center the tooltip
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;