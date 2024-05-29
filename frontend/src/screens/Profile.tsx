import React, { useState } from "react";
import postsGrid from '../components/postsGrid';
import groupsList from '../components/GroupsList';
import { FaCog } from "react-icons/fa";
import SettingsModal from '../components/SettingsModal';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showSettings, setShowSettings] = useState(false);

  ////////////Temp Posts for the grid//////////////////
  const posts = [
    "Post 1",
    "Post 2",
    "Post 3",
    "Post 4",
    "Post 5",
    "Post 6",
	"Post 7",
  ];
  ////////////////////////////////////////////////////
  const groups = [
    "Group 1",
    "Group 2",
    "Group 3",
    "Group 4",
    "Group 5",
    "Group 6",
	"Group 7",
]
////////////////////////////////////////////////////
  return (
    <div className="flex flex-col items-center">
      {/* Profile Picture and Username */}
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gray-300 mb-2"></div>
        <h1 className="text-xl font-bold">Username</h1>
      </div>

       {/* Settings Icon */}
       <div className="absolute top-4 right-4 cursor-pointer">
        <FaCog
          className="text-gray-500 hover:text-gray-700"
          size={24}
          onClick={() => setShowSettings(true)}
        />
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
      <div className="mt-8 w-full">
        {activeTab === "posts" ? (
          <div>
            <h2>Posts</h2>
			
            {postsGrid({ posts })}
          </div>
        ) : (
          <div>
            <h2>Groups</h2>
            {groupsList({groups})}
          </div>
        )}
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Profile;
