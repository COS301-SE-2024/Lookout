import React, { useEffect, useState } from "react";
import PostsGrid from "../components/postsGrid";
import GroupsList from "../components/GroupsList";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingsModal";

type Group = {
  id: number;
  name: string;
  owner: string;
  picture: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showSettings, setShowSettings] = useState(false);

  ////////////Temp Posts for the grid//////////////////
  const posts = [
    {
      id: 1,
      imageUrl:
        "https://i.pinimg.com/originals/2e/c0/77/2ec0773a1fcd847a5bd258ea4bba668e.jpg",
      description: "The Setting Sun",
    },
    {
      id: 2,
      imageUrl:
        "https://i.pinimg.com/originals/bf/d9/ad/bfd9ad5453ee46784f071cafb68c02b4.jpg",
      description: "Zebra Family",
    },
    {
      id: 3,
      imageUrl:
        "https://i.pinimg.com/originals/d7/45/a0/d745a0938efa00a33aef6f73135fe3ee.jpg",
      description: "Curious Cheetah",
    },
    {
      id: 4,
      imageUrl:
        "https://i.pinimg.com/originals/12/9d/5f/129d5f467b48f214224e155d4fa153b8.jpg",
      description: "Beautiful Clouds",
    },
    {
      id: 5,
      imageUrl:
        "https://i.pinimg.com/originals/37/b4/63/37b463a42a437b19e5b8a7117fca473c.jpg",
      description: "Tall Giraffes",
    },
    // { id: 6, imageUrl: '', description: 'Post 6' },
    // { id: 7, imageUrl: '', description: 'Post 7' },
  ];
  ////////////////////////////////////////////////////
  const [groups, setGroups] = useState<Group[]>([]);
  useEffect(() => {
    fetch("/api/groups/user/1", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setGroups(data))
      .catch((error) => console.error("Error:", error));
  }, []);
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
