import React from 'react';

const GroupDetailSkeleton: React.FC = () => {
  return (
    <div className="p-4 scrollbar-hide">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* Back Button */}
      <div className="absolute top-14 left-4 md:top-20 md:left-8 text-gray-300">
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

      <div className="container mx-auto p-4 mt-10 relative">
        {/* Group Image and Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-center items-center">
          {/* Group Picture Skeleton */}
          <div className="w-56 h-56 bg-gray-300 rounded-lg animate-pulse mb-4 md:mb-0 md:mr-8"></div>

          {/* Group Details Skeleton */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            {/* Group Name */}
            <div className="w-40 h-8 bg-gray-300 rounded-lg animate-pulse mb-2"></div>

            {/* Group Description Skeleton */}
            <div className="w-80 h-24 bg-gray-300 rounded-lg animate-pulse mb-2"></div>

            {/* Posts and Followers Count */}
            <div className="flex flex-col md:flex-row items-center mb-2">
              <div className="flex flex-row items-center">
                <div className="w-16 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <div className="w-16 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Creation Date */}
            <div className="w-40 h-4 bg-gray-300 rounded-lg animate-pulse mb-4"></div>

            {/* Buttons Skeleton */}
            <div className="flex gap-1">
              <div className="w-28 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="w-28 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div className="w-32 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>

          {/* Horizontal Carousel Skeleton */}
          <div className="flex space-x-4 overflow-x-auto">
            <div className="w-48 h-48 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-48 h-48 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="w-48 h-48 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* About the Owner Section */}
        <div className="flex justify-between items-center mb-4 mt-4 ml-4">
          <div className="w-32 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-20 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>

        {/* Owner Information */}
        <div className="mt-4 ml-4">
          <div className="flex items-center mb-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse mr-6"></div>
            <div>
              <div className="w-32 h-6 bg-gray-300 rounded-lg animate-pulse mb-2"></div>
              <div className="w-48 h-4 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailSkeleton;
