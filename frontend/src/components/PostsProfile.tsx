import React, { useState } from "react";
import PostsGridFix from "./PostsGridFix";
import SavedPostsGridFix from "./SavedPostsGridFix";

const PostsProfile = () => {
  const [selectedOption, setSelectedOption] = useState<string>('yourPosts');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="w-full"> {/* Full width with smaller padding */}
    <div className="mb-4 flex flex-col space-y-4"> {/* Removed unnecessary ml-4 */}
    <div className="flex items-center justify-between space-x-2">
      {/* Filter Dropdown */}
      <select
        id="postFilter"
        value={selectedOption}
        onChange={handleChange}
        className="border p-2 rounded bg-gray-200"
      >
        <option value="yourPosts">Your posts</option>
        <option value="savedPosts">Saved posts</option>
      </select>
    </div>

    {/* Apply styling here */}
    <div className="w-full flex justify-center"> {/* Center the content */}
      <div className="w-full max-w-6xl"> {/* Larger grid area */}
        {selectedOption === 'yourPosts' ? (
          <PostsGridFix searchQuery={searchQuery} />
        ) : (
          <SavedPostsGridFix searchQuery={searchQuery} />
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default PostsProfile;
