import React from 'react';

const GroupsGridSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen bg-bkg">
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center p-2 border rounded-lg shadow-sm bg-gray-200 animate-pulse"
          >
            <div className="flex-shrink-0 w-24 h-24 bg-gray-300 rounded-md"></div>
            <div className="flex-1 ml-4">
              <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md"></div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsGridSkeleton;
