import React, { useState, useEffect, useRef } from "react";
import AWS from "aws-sdk";
import ProfileSkeleton from "../components/ProfileSkeleton";
import PostsProfile from "../components/PostsProfile";
import GroupsProfile from "../components/GroupsProfile";
import { FaCog } from "react-icons/fa";
import SettingsModal from "../components/SettingsModal";
import { useLocation } from "react-router-dom";
import Modal from "../components/Modal";
import profilePhoto from "../assets/styles/images/mockprofilephoto.png";

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
	const [, setPreviewUrl] = useState<string | undefined>(undefined);

	const [isUploadingPicture, setIsUploadingPicture] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [profilePic, setProfilePic] = useState<string | null>(null);

	useEffect(() => {
		if (state?.message) {
			setMessage(state.message);
			setModalOpen(true);
		}
	}, [state]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [userResponse, postsCountResponse, groupsCountResponse] =
					await Promise.all([
						fetch(`/api/users/`, {
							headers: { Accept: "application/json" }
						}),
						fetch(`/api/users/postsCount`, {
							headers: { Accept: "application/json" }
						}),
						fetch(`/api/users/groupsCount`, {
							headers: { Accept: "application/json" }
						})
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

	const closeModal = () => {
		setModalOpen(false);
		setMessage("");
	};

	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// AWS S3 Configuration
	const region = "eu-west-1";
	const bucketName = "lookout-bucket-capstone";
	const accessKeyId = process.env.REACT_APP_AWS_S3_ACCESS_ID || "";
	const secretAccessKey =
		process.env.REACT_APP_AWS_S3_SECRET_ACCESS_KEY || "";

	// Initialize AWS S3
	const s3 = new AWS.S3({
		region,
		accessKeyId,
		secretAccessKey,
		signatureVersion: "v4"
	});

	// Helper function to generate a random string for unique file names
	const generateRandomString = (length: number): string => {
		const array = new Uint8Array(length / 2);
		window.crypto.getRandomValues(array);
		return Array.from(array, (byte) =>
			("0" + byte.toString(16)).slice(-2)
		).join("");
	};

	const generateUploadURL = async (): Promise<string> => {
		const randomBytes = generateRandomString(16);
		const imageName = randomBytes.toString();

		const params = {
			Bucket: bucketName,
			Key: imageName,
			Expires: 60
		};

		const uploadURL = await s3.getSignedUrlPromise("putObject", params);
		return uploadURL;
	};

	const uploadImageFileToS3 = async (file: File): Promise<void> => {
		if (!file) {
			throw new Error("No file provided for upload.");
		}

		try {
			const uploadURL = await generateUploadURL();

			await fetch(uploadURL, {
				method: "PUT",
				headers: {
					"Content-Type": file.type
				},
				body: file
			});

			const imageUrl = uploadURL.split("?")[0];
			setIsUploadingPicture(false);

			console.log("Image uploaded successfully.", imageUrl);

			// Update the user's profile picture in the backend
			await updateUserPicture(imageUrl);
		} catch (error) {
			console.error("Error uploading file:", error);
			setIsUploadingPicture(false);
		}
	};

	const updateUserPicture = async (pictureUrl: string) => {
		try {
			const response = await fetch(`/api/users/`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ profilePic: pictureUrl })
			});
			if (!response.ok) {
				throw new Error("Failed to update user picture");
			}

			setProfilePic(pictureUrl);
		} catch (error) {
			console.error("Error updating user picture:", error);
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setIsUploadingPicture(true);
			try {
				await uploadImageFileToS3(file);
			} catch (error) {
				console.error("Error uploading picture:", error);
			} finally {
				setIsUploadingPicture(false);
			}
		}
	};

	return (
		<div className="relative flex flex-col items-center w-full min-h-screen">
			{dataLoaded ? (
				<>
					{/* Settings Icon */}
					<div className="absolute top-4 right-4 cursor-pointer mt-2">
						<FaCog
							className="text-gray-500 hover:text-gray-700"
							size={24}
							onClick={() => setShowSettings(true)}
						/>
					</div>

					{/* Profile Picture */}
					<div
						className="mt-10 cursor-pointer relative"
						style={{ width: "96px", height: "96px" }}
					>
						<img
							className="w-24 h-24 rounded-full bg-gray-300 mb-2 cursor-pointer object-cover"
							src={profilePic || profilePhoto}
							alt="Profile"
							onClick={handleImageClick}
						/>
						{isUploadingPicture && (
							<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-full">
								<svg
									className="animate-spin h-8 w-8 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v8H4z"
									></path>
								</svg>
							</div>
						)}
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							ref={fileInputRef}
							style={{ display: "none" }}
						/>
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
