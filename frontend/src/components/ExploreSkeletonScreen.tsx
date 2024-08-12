import React from 'react';

const ExploreSkeletonScreen: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded mb-4"></div>

      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="min-w-[300px] h-96 bg-gray-300 rounded-lg transition-transform duration-300 hover:scale-105"></div>
        ))}
      </div>

      <div className="h-8 bg-gray-300 rounded mb-4 mt-8"></div>
      
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="min-w-[300px] h-96 bg-gray-300 rounded-lg transition-transform duration-300 hover:scale-105"></div>
        ))}
      </div>
      
      <div className="h-8 bg-gray-300 rounded mb-4 mt-8"></div>
      
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="min-w-[300px] h-96 bg-gray-300 rounded-lg transition-transform duration-300 hover:scale-105"></div>
        ))}
      </div>
      
      <div className="h-8 bg-gray-300 rounded mb-4 mt-8"></div>
      
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="min-w-[300px] h-96 bg-gray-300 rounded-lg transition-transform duration-300 hover:scale-105"></div>
        ))}
      </div>

      <div className="h-8 bg-gray-300 rounded mb-4 mt-8"></div>
      
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="min-w-[300px] h-96 bg-gray-300 rounded-lg transition-transform duration-300 hover:scale-105"></div>
        ))}
      </div>
    </div>
  );
};

export default ExploreSkeletonScreen;
