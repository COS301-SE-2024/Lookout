import React from 'react';

const PinDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto p-4 relative max-h-screen overflow-y-auto">
      <div className="absolute top-4 left-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
      <div className="card bg-base-94 shadow-xl rounded-lg">
        <div className="rounded-t-lg overflow-hidden">
          <div className="w-full h-40 sm:h-52 bg-gray-300 animate-pulse"></div>
        </div>
        <div className="card-body p-4">
          <div className="flex items-center justify-between mt-2 mb-4">
            <div className="h-8 w-2/3 sm:w-1/2 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="ml-2 h-4 w-12 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center mb-4 justify-between w-full">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="ml-4 sm:ml-6">
                <div className="h-6 w-24 sm:w-32 bg-gray-300 animate-pulse rounded-md"></div>
                <div className="mt-2 h-4 w-20 sm:w-24 bg-gray-300 animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <div className="h-8 w-full sm:w-32 bg-gray-300 animate-pulse rounded-full"></div>
            <div className="h-8 w-full sm:w-32 bg-gray-300 animate-pulse rounded-full"></div>
          </div>
          <div className="mt-6 mb-8">
            <div className="h-6 w-32 sm:w-48 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="mt-4 flex space-x-4 overflow-hidden">
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="w-20 sm:w-24 h-20 sm:h-24 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetailSkeleton;