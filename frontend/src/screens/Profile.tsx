import React, { useState } from "react";
import PostsGrid from '../components/postsGrid';
import GroupsList from '../components/GroupsList';
import { FaCog } from "react-icons/fa";
import SettingsModal from '../components/SettingsModal';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showSettings, setShowSettings] = useState(false);

  ////////////Temp Posts for the grid//////////////////
  const posts = [
    { id: 1, imageUrl: 'https://i.pinimg.com/originals/2e/c0/77/2ec0773a1fcd847a5bd258ea4bba668e.jpg', description: 'The Setting Sun' },
    { id: 2, imageUrl: 'https://i.pinimg.com/originals/bf/d9/ad/bfd9ad5453ee46784f071cafb68c02b4.jpg', description: 'Zebra Family' },
    { id: 3, imageUrl: 'https://i.pinimg.com/originals/d7/45/a0/d745a0938efa00a33aef6f73135fe3ee.jpg', description: 'Curious Cheetah' },
    { id: 4, imageUrl: 'https://i.pinimg.com/originals/12/9d/5f/129d5f467b48f214224e155d4fa153b8.jpg', description: 'Beautiful Clouds' },
    { id: 5, imageUrl: 'https://i.pinimg.com/originals/37/b4/63/37b463a42a437b19e5b8a7117fca473c.jpg', description: 'Tall Giraffes' },
    // { id: 6, imageUrl: '', description: 'Post 6' },
    // { id: 7, imageUrl: '', description: 'Post 7' },
  ];
  ////////////////////////////////////////////////////
  const groups = [
    { id: 1, name: 'Hidden Gems', owner: 'Evelyn Smith', picture: 'https://i.pinimg.com/originals/80/4c/82/804c82e561475688f6c115e3df2d8288.jpg', description: 'Explore the hidden gems of the wilderness.' },
    { id: 2, name: 'For the Love of Trees', owner: 'Alex Anderson', picture: 'https://i.pinimg.com/originals/4d/d7/c0/4dd7c0f68fd9d0d51f13cba3a8f24163.jpg', description: 'A group for tree lovers and conservationists.' },
    { id: 3, name: 'Sunset Moments', owner: 'Harper Garcia', picture: 'https://i.pinimg.com/originals/51/c2/d2/51c2d29f95977f38e9be0d20a599d42c.jpg', description: 'Capture and share beautiful sunset moments.' },
    { id: 4, name: 'Elephant Fanatics', owner: 'Ava Jackson', picture: 'https://i.pinimg.com/originals/62/5b/0e/625b0e73e60198e123ba03a6ae1bc574.jpg', description: 'Dedicated to the protection and admiration of elephants.' },
    { id: 5, name: 'Stripe Savvy Syndicate ', owner: 'Anthony Harris', picture: 'https://i.pinimg.com/originals/cb/e7/d3/cbe7d319fa566e5d19d25921d2ec7ca5.jpg', description: 'A group for those passionate about striped animals.' },
  ];
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
            <PostsGrid posts={posts} />
          </div>
        ) : (
          <div>
            <GroupsList groups={groups} />
          </div>
        )}
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default Profile;
