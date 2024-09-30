import React, { useState, useEffect, useRef } from "react";
import AWS from "aws-sdk";
import ProfileSkeleton from "../components/ProfileSkeleton";
import PostsProfile from "../components/PostsProfile";
import GroupsProfile from "../components/GroupsProfile";
import { useLocation } from "react-router-dom";
import profilePhoto from "../assets/styles/images/user.png";
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
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
	const [profilePic, setProfilePic] = useState<string | null>(null);
	const [isUploadingPicture, setIsUploadingPicture] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (state?.message) {
			// Handle any state messages if necessary
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

					setProfilePic(userData.profilePic);
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


			// Update the user's profile picture in the backend
			await updateUserPicture(imageUrl);
		} catch (error) {
			console.error("Error uploading file:", error);
			setIsUploadingPicture(false);
		}
	};

	const updateUserPicture = async (pictureUrl: string) => {
		try {
			const response = await fetch(`/api/users/update-profile-pic`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ newProfilePicUrl: pictureUrl })
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

	if (!dataLoaded) {
		return <ProfileSkeleton />;
	}

	return (
		<div className="relative flex flex-col items-center w-full min-h-screen p-4 sm:p-8">
			{/* Profile Picture */}
			<div className="cursor-pointer relative group w-24 h-24 sm:w-32 sm:h-32 mb-4">
				<img
					className="w-full h-full rounded-full bg-gray-300 object-cover"
					src={profilePic || profilePhoto}
					alt="Profile"
				/>
				{isUploadingPicture && (
					<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full z-20">
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
				{/* Overlay div */}
				<div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full z-10">
					Change Profile Picture
				</div>
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					ref={fileInputRef}
					style={{ display: "none" }}
				/>

				{/* Edit Icon */}

				<div
					className="absolute bottom-0 right-0 mb-1 mr-1 cursor-pointer"
					onClick={handleImageClick} // Trigger file input when clicking the icon
				>
					<FaEdit
						className="bg-gray-200 text-navBkg p-1 rounded-full"
						size={30}
					/>
				</div>


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
