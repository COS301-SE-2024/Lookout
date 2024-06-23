import React, { useState,useEffect } from "react";
import PostsGrid from "../components/postsGrid";
import GroupsList from "../components/GroupsList";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingsModal";
import { useLocation } from 'react-router-dom';
import Modal from '../components/Modal';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [showSettings, setShowSettings] = useState(false);
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

  const closeModal = () => {
    setModalOpen(false);
    setMessage('');
  };

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
          <PostsGrid />
        </div>
        ) : (
          <div>
            <GroupsList />
          </div>
        )}
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <Modal isOpen={modalOpen} onClose={closeModal} message={message} />
    </div>
  );
};

export default Profile;
