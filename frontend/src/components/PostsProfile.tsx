import React, { useState } from "react";
import PostsGridFix from "./PostsGridFix";
import SavedPostsGridFix from "./SavedPostsGridFix";

const Profile = () => {
  const [selectedOption, setSelectedOption] = useState<string>('yourPosts');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const placeholderText = selectedOption === 'yourPosts'
    ? 'Search your posts'
    : 'Search saved posts';

  return (
    <div className="container mx-auto p-4">
      <div className="mb-1 flex flex-col space-y-4 ml-4">
        {/* Search Bar and Filter Dropdown on the Same Line */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={handleSearchChange}
            className="border p-2 rounded w-full max-w-md bg-gray-200"
          />

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
      </div>

      {/* Display Posts */}
      {selectedOption === 'yourPosts' ? <PostsGridFix searchQuery={searchQuery} /> : <SavedPostsGridFix searchQuery={searchQuery} />}
    </div>
  );
};

export default Profile;
