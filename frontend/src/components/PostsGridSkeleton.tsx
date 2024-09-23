import React from 'react';

const PostsGridSkeleton: React.FC = () => {
  return (
    <div className="p-4 scrollbar-hide">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-md shadow-lg bg-gray-200 animate-pulse"
          >
            <div className="w-full h-40 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 mb-2"></div>
              <div className="h-4 bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsGridSkeleton;
