import React, { useState, useEffect } from "react";
import ProfileSkeleton from "../components/ProfileSkeleton";
import PostsProfile from "../components/PostsProfile";
import GroupsProfile from "../components/GroupsProfile";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingsModal";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import profilePhoto from "../assets/styles/images/mockprofilephoto.png";
import S3Uploader from "../components/S3Uploader";

const Profile = () => {
  const userId = 1;
  const [activeTab, setActiveTab] = useState("posts");
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState("Loading...");
  const [postsCount, setPostsCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false); // Loading state
  const location = useLocation();
  const { state } = location;
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [, setPreviewUrl] = useState<string | undefined>(undefined);
  const previewURL = localStorage.getItem("previewUrl");

  useEffect(() => {
    if (state?.message) {
      setMessage(state.message);
      setModalOpen(true);
    }
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, postsCountResponse, groupsCountResponse] = await Promise.all([
          fetch(`/api/users/${userId}`, { headers: { Accept: "application/json" } }),
          fetch(`/api/users/postsCount/${userId}`, { headers: { Accept: "application/json" } }),
          fetch(`/api/users/groupsCount/${userId}`, { headers: { Accept: "application/json" } }),
        ]);

        const userData = await userResponse.json();
        const postsCountData = await postsCountResponse.json();
        const groupsCountData = await groupsCountResponse.json();

        setUsername(userData.userName || "Unknown User");
        setPostsCount(postsCountData);
        setGroupsCount(groupsCountData);

        // Profile picture logic
        if (userData.profilePic !== null) {
          localStorage.setItem("previewUrl", userData.profilePic);
          setPreviewUrl(userData.profilePic);
        }

        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsername("User");
        setPostsCount(0);
        setGroupsCount(0);
        setDataLoaded(true);
      }
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    setMessage("");
  };

  const togglePhotoClick = () => {
    setOpen(!open);
  };

  // Show ProfileSkeleton if data isn't loaded yet
  if (!dataLoaded) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen p-8">
      {/* Profile Picture */}
      <div className=" cursor-pointer">
        <img
          className="w-32 h-32 rounded-full bg-gray-300 mb-4 cursor-pointer"
          src={previewURL || profilePhoto}
          alt="Preview"
          onClick={togglePhotoClick}
        />
      </div>

      {/* Username */}
      <div className="mt-2 text-center">
        <h1 className="text-3xl font-bold">{username}</h1>
      </div>

      {/* Followers and Following */}
      <div className="flex flex-row items-center space-x-4 mt-2">
        <span className="text-lg">{postsCount} Posts</span>
        <div className="w-px h-8 bg-gray-300"></div>
        <span className="text-lg">{groupsCount} Groups</span>
      </div>

      {/* Mini Navbar */}
      <div className="flex mt-4 text-lg space-x-12">
        <button
          className={`px-6 py-3 focus:outline-none ${activeTab === "posts"
              ? "border-b-4 border-[#6A994E] font-bold"
              : "text-gray-500"
            }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`px-6 py-3 focus:outline-none ${activeTab === "groups"
              ? "border-b-4 border-[#6A994E] font-bold"
              : "text-gray-500"
            }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {/* Content */}
      <div className="text-lg w-full max-w-screen-xl mx-auto mt-6">
        {activeTab === "posts" && <PostsProfile />}
        {activeTab === "groups" && <GroupsProfile />}
      </div>
    </div>
  );
};

export default Profile;
