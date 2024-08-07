import React from 'react';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center w-full min-h-screen p-4">
      {/* Settings Icon */}
      <div className="absolute top-4 right-4 cursor-pointer mt-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
      </div>

      {/* Profile Picture */}
      <div className="mt-10 cursor-pointer">
        <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse mb-2"></div>
      </div>

      {/* Username */}
      <div className="mt-4 text-center">
        <div className="h-6 w-32 bg-gray-300 animate-pulse rounded-md mx-auto"></div>
      </div>

      {/* Followers and Following */}
      <div className="mt-2 text-center">
        <div className="flex space-x-4">
          <div className="h-4 w-12 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="h-4 w-12 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>

      {/* Mini Navbar */}
      <div className="flex mt-6 text-base space-x-8">
        <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
        <div className="w-24 h-8 bg-gray-300 animate-pulse rounded-md"></div>
      </div>

      {/* Content */}
      <div className="text-sm w-full max-w-screen-lg mx-auto mt-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="w-full h-40 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-full h-40 bg-gray-300 animate-pulse rounded-md"></div>
          <div className="w-full h-40 bg-gray-300 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
