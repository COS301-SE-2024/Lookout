import React from 'react';

const PinDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 mx-auto max-w-screen-lg flex flex-col h-screen bg-bkg">
      <div className="relative mb-8">
        {/* You can add a placeholder for any additional header elements here */}
      </div>

      <div className="card bg-base-100 shadow-xl rounded-lg flex flex-col h-full md:flex-row min-h-[550px]">
        <div className="w-full md:w-1/2 h-72 md:h-96 bg-gray-300 animate-pulse min-h-[550px] rounded-t-lg md:rounded-t-none md:rounded-l-lg"></div>
        
        <div className="card-body p-6 md:w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="w-1/2 h-10 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
              <div className="ml-3 h-6 w-20 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>

          <div className="flex items-center mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 animate-pulse rounded-full mr-6"></div>
            <div className="flex flex-col justify-between">
              <div className="h-8 w-48 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="mt-3 h-6 w-32 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>

          <div className="flex flex-col space-y-3 mt-6">
            <div className="h-10 w-full bg-gray-300 animate-pulse rounded-full"></div>
            <div className="h-10 w-full bg-gray-300 animate-pulse rounded-full"></div>
          </div>

          <div className="mt-8 mb-10">
            <div className="h-8 w-48 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="mt-6 flex space-x-4 overflow-hidden">
              <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-md"></div>
              <div className="w-24 h-24 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetailSkeleton;
