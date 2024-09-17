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
	const [dataLoaded, setDataLoaded] = useState(false);
	const location = useLocation();
	const { state } = location;
	const [modalOpen, setModalOpen] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (state?.message) {
			setMessage(state.message);
			setModalOpen(true);
		}
	}, [state]);

	const [open, setOpen] = useState<boolean>(false);
	const [, setPreviewUrl] = useState<string | undefined>(undefined);
	const previewURL = localStorage.getItem("previewUrl");

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch user data
				const userResponse = await fetch(`/api/users/${userId}`, {
					headers: {
						Accept: "application/json"
					}
				});
				const userData = await userResponse.json();
				setUsername(userData.userName || "Unknown User");

				// Fetch posts count
				const postsCountResponse = await fetch(
					`/api/users/postsCount/${userId}`,
					{
						headers: {
							Accept: "application/json"
						}
					}
				);
				const postsCountData = await postsCountResponse.json();
				setPostsCount(postsCountData);

				// Fetch groups count
				const groupsCountResponse = await fetch(
					`/api/users/groupsCount/${userId}`,
					{
						headers: {
							Accept: "application/json"
						}
					}
				);
				const groupsCountData = await groupsCountResponse.json();
				setGroupsCount(groupsCountData);

				// Fetch profile picture
				const profilePicResponse = await fetch(`/api/users/${userId}`);
				const profilePicData = await profilePicResponse.json();
				if (profilePicData.profilePic !== null) {
					localStorage.setItem(
						"previewUrl",
						profilePicData.profilePic
					);
					setPreviewUrl(profilePicData.profilePic);
				}

				setDataLoaded(true); // Set data loaded to true
			} catch (error) {
				console.error("Error fetching data:", error);
				setUsername("User");
				setPostsCount(0);
				setGroupsCount(0);
				setDataLoaded(true); // Set data loaded to true even on error
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

	return (
		<div className="relative flex flex-col items-center w-full min-h-screen">
			{dataLoaded ? (
				<>
					{/* Settings Icon */}
					{/* <div className="absolute top-4 right-4 cursor-pointer mt-2">
						<FaCog
							className="text-gray-500 hover:text-gray-700"
							size={24}
							onClick={() => setShowSettings(true)}
						/>
					</div> */}

					{/* Profile Picture */}
					<div className="mt-10 cursor-pointer">
						<img
							className="w-24 h-24 rounded-full bg-gray-300 mb-2 cursor-pointer"
							src={previewURL || profilePhoto}
							alt="Preview"
							onClick={togglePhotoClick}
						/>
						{open && <S3Uploader setOpen={setOpen} />}
					</div>

					{/* Username */}
					<div className="mt-4 text-center">
						<h1 className="text-xl font-bold">{username}</h1>
					</div>

					{/* Followers and Following */}
					<div className="mt-2 text-center">
						<span className="font-bold">{postsCount}</span> posts |{" "}
						<span className="font-bold">{groupsCount}</span> groups
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
					{showSettings && (
						<SettingsModal onClose={() => setShowSettings(false)} />
					)}
					<Modal
						isOpen={modalOpen}
						onClose={closeModal}
						message={message}
					/>
				</>
			) : (
				<ProfileSkeleton />
			)}
		</div>
	);
};

export default Profile;
