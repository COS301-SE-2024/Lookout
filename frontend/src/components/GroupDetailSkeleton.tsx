import React from 'react';

const GroupDetailSkeleton: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-gray-300 to-gray-100 clip-path-custom-arch z-0"></div>
      <div className="container mx-auto p-4 relative z-10">
        {/* Back Button */}
        <div className="absolute top-4 left-4 text-gray-300 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </div>

        {/* Join/Leave Button */}
        <div className="absolute top-4 right-4 bg-gray-300 rounded-full px-4 py-2 cursor-not-allowed animate-pulse"></div>

        {/* Group Name */}
        <div className="text-center mb-4">
          <div className="w-1/2 mx-auto h-8 bg-gray-300 rounded-lg animate-pulse mb-4 mt-4"></div>
          <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full animate-pulse mb-4"></div>
          <div className="w-3/4 mx-auto h-6 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-1 mb-4">
          <div className="px-4 py-2 rounded-full bg-gray-300 text-white animate-pulse"></div>
          <div className="px-4 py-2 rounded-full bg-gray-300 text-white animate-pulse"></div>
        </div>

        {/* Posts Section */}
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/4 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-1/4 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>

        <div className="mb-8">
          <div className="w-full h-64 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-full h-64 bg-gray-300 rounded-lg animate-pulse mt-4"></div>
        </div>

        {/* About the Owner Section */}
        <div className="flex justify-between items-center mb-4 mt-4">
          <div className="w-1/4 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-1/4 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex items-center mb-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full mr-6 animate-pulse"></div>
          <div>
            <div className="w-1/2 h-6 bg-gray-300 rounded-lg animate-pulse mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailSkeleton;
