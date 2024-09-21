import React from 'react';

const GroupPostsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen bg-bkg">
      {/* Back Arrow Skeleton */}
      <div className="absolute top-4 left-4 z-50">
        <div className="h-8 w-8 bg-gray-300 animate-pulse rounded-full"></div>
      </div>

      <div className="text-center mb-8">
        <div className="h-10 w-1/2 bg-gray-300 animate-pulse mx-auto rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-300 animate-pulse h-64 rounded-md"></div>
        ))}
      </div>
    </div>
  );
};

export default GroupPostsSkeleton;
