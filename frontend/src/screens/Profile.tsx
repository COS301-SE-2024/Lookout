import React, { useState, useEffect } from "react";
import PostsGrid from "../components/postsGrid";
import SavedPostsGrid from "../components/savedPostsGrid";
import GroupsList from "../components/GroupsList";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingsModal";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import S3Uploader from "../components/S3Uploader";

const Profile = () => {
	const [activeTab, setActiveTab] = useState("posts");
	const [showSettings, setShowSettings] = useState(false);
	const location = useLocation();
	const { state } = location;
	const [modalOpen, setModalOpen] = useState(false);
	const [message, setMessage] = useState("");
	//const [profile, setPicture] = useState(""); // add profile picture

	const fileInputRef = React.useRef<HTMLInputElement | null>(null);
	const [defaultUrl, setDefaultUrl] = useState("./logo192.png");
	const [previewUrl, setPreviewUrl] = useState();

	useEffect(() => {
		if (state?.message) {
			setMessage(state.message);
			setModalOpen(true);
		}
	}, [state]);

	useEffect(() => {
		setDefaultUrl("./logo192.png");
	}, []);

	const previewURL = localStorage.getItem("previewUrl");

	const closeModal = () => {
		setModalOpen(false);
		setMessage("");
	};

	// const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	//   const file = event.target.files?.[0];
	//   if (file) {
	//     const fileUrl = URL.createObjectURL(file);
	//     //setPicture(fileUrl);
	//     console.log(fileUrl)
	//   }
	// };

	const [open, setOpen] = useState<boolean>(false);

	const togglePhotoClick = () => {
		setOpen(!open);
	};

	return (
		<div className="flex flex-col items-center">
			{/* Profile Picture and Username */}
			<div className="flex flex-col items-center">
				<img
					className="w-24 h-24 rounded-full bg-gray-300 mb-2 cursor-pointer"
					src={previewURL || defaultUrl}
					alt="Preview"
					onClick={togglePhotoClick}
				/>
				{open && <S3Uploader setOpen={setOpen} />}

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
					Your Posts
				</button>
				<button
					className={`button px-4 py-2 mr-4 rounded focus:outline-none ${
						activeTab === "savedPosts"
							? "active border-b-4 border-[#6A994E] font-bold"
							: ""
					}`}
					onClick={() => setActiveTab("savedPosts")}
				>
					Saved Posts
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
				{activeTab === "posts" && <PostsGrid />}
				{activeTab === "savedPosts" && <SavedPostsGrid />}
				{activeTab === "groups" && <GroupsList />}
			</div>
			{showSettings && (
				<SettingsModal onClose={() => setShowSettings(false)} />
			)}
			<Modal isOpen={modalOpen} onClose={closeModal} message={message} />
		</div>
	);
};

export default Profile;
