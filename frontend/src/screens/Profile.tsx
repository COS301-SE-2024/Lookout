import React, { useState } from "react";
import postsGrid from '../components/postsGrid';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const posts = [
    "Post 1",
    "Post 2",
    "Post 3",
    "Post 4",
    "Post 5",
    "Post 6",
	"Post 7",
  ];
  return (
    <div className="flex flex-col items-center">
      {/* Profile Picture and Username */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-2"></div>
        <h1 className="text-xl font-bold">Username</h1>
      </div>

      {/* Mini Navbar */}
      <div className="flex mt-4">
        <button
          className={`button px-4 py-2 mr-4 rounded focus:outline-none ${
            activeTab === "posts"
              ? "active border-b-4 border-[#6A994E] font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`button px-4 py-2 rounded focus:outline-none ${
            activeTab === "groups"
              ? "active border-b-4 border-[#6A994E] font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === "posts" ? (
          <div>
            <h2>Posts</h2>
			
            {postsGrid({ posts })}
          </div>
        ) : (
          <div>
            <h2>Groups</h2>
            {/* Your groups content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
