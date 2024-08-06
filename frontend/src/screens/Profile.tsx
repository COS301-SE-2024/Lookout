import React, { useState, useEffect } from "react";
import PostsProfile from "../components/PostsProfile";
import GroupsProfile from "../components//GroupsProfile";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingsModal";
import { useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import profilePhoto from '../assets/styles/images/mockprofilephoto.png';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [username, setUsername] = useState("Loading...");
  const [postsCount, setPostsCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const location = useLocation();
  const { state } = location;
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state?.message) {
      setMessage(state.message);
      setModalOpen(true);
    }
  }, [state]);

  useEffect(() => {
    // Fetch user data
    fetch("/api/user/1", {
      headers: {
        "Accept": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setUsername(data.userName || "Unknown User");
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
        setUsername("User");
      });

    // Fetch posts count
    fetch("/api/users/postsCount/1", {
      headers: {
        "Accept": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setPostsCount(data);
      })
      .catch(error => {
        console.error("Error fetching posts count:", error);
        setPostsCount(0);
      });

    // Fetch groups count
    fetch("/api/users/groupsCount/1", {
      headers: {
        "Accept": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        setGroupsCount(data);
      })
      .catch(error => {
        console.error("Error fetching groups count:", error);
        setGroupsCount(0);
      });
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setMessage('');
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen">

      {/* Settings Icon */}
      <div className="absolute top-4 right-4 cursor-pointer mt-2">
        <FaCog
          className="text-gray-500 hover:text-gray-700"
          size={24}
          onClick={() => setShowSettings(true)}
        />
      </div>

      {/* Profile Picture */}
      <div className="mt-10">
        <img
          src={profilePhoto}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
          onClick={() => setShowEditProfile(true)}
        />
      </div>

      {/* Username */}
      <div className="mt-4 text-center">
        <h1 className="text-xl font-bold">{username}</h1>
        <p className="text-gray-600">An about will be added soon for users </p>
      </div>

      {/* Followers and Following */}
      <div className="mt-2 text-center">
        <span className="font-bold">{postsCount}</span> posts | <span className="font-bold">{groupsCount}</span> groups
      </div>

      {/* Mini Navbar */}
      <div className="flex mt-6 text-base space-x-8">
        <button
          className={`px-4 py-2 focus:outline-none ${
            activeTab === "posts"
              ? "border-b-4 border-[#6A994E] font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 focus:outline-none ${
            activeTab === "groups"
              ? "border-b-4 border-[#6A994E] font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {/* Content */}
      <div className="text-sm w-full max-w-screen-lg mx-auto mt-4">
        {activeTab === "posts" && <PostsProfile />}
        {activeTab === "groups" && <GroupsProfile />}
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <Modal isOpen={modalOpen} onClose={closeModal} message={message} />
    </div>
  );
};

export default Profile;
