import React, { useState, useEffect } from "react";
import ProfileSkeleton from "../components/ProfileSkeleton";
import PostsProfile from "../components/PostsProfile";
import GroupsProfile from "../components/GroupsProfile";
import { useLocation } from "react-router-dom";
import profilePhoto from "../assets/styles/images/mockprofilephoto.png";

const Profile = () => {
  const userId = 1;
  const [activeTab, setActiveTab] = useState(() => {
    // Check localStorage for the active tab, default to "posts"
    return localStorage.getItem("activeTab") || "posts";
  });
  const [username, setUsername] = useState("Loading...");
  const [postsCount, setPostsCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
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

  useEffect(() => {
    // Store active tab in localStorage whenever it changes
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const closeModal = () => {
    setModalOpen(false);
    setMessage("");
  };

  const togglePhotoClick = () => {
    setOpen(!open);
  };

  if (!dataLoaded) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen p-4 sm:p-8">
      {/* Profile Picture */}
      <div className="cursor-pointer">
        <img
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 mb-4"
          src={previewURL || profilePhoto}
          alt="Profile"
          onClick={togglePhotoClick}
        />
      </div>

      {/* Username */}
      <div className="mt-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">{username}</h1>
      </div>

      {/* Posts and Groups Count */}
      <div className="flex flex-row items-center space-x-4 mt-2">
        <span className="text-md sm:text-lg">{postsCount} Posts</span>
        <div className="w-px h-8 bg-content"></div>
        <span className="text-md sm:text-lg">{groupsCount} Groups</span>
      </div>

      {/* Mini Navbar */}
      <div className="flex mt-4 space-x-8 sm:space-x-12">
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 focus:outline-none ${activeTab === "posts"
            ? "border-b-4 border-navBkg font-bold"
            : "text-gray-500"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 focus:outline-none ${activeTab === "groups"
            ? "border-b-4 border-navBkg font-bold"
            : "text-gray-500"
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-6 px-2">
        {activeTab === "posts" && <PostsProfile />}
        {activeTab === "groups" && <GroupsProfile />}
      </div>
    </div>
  );
};

export default Profile;
