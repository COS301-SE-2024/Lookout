import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AWS from "aws-sdk";
import GroupDetailSkeleton from "../components/GroupDetailSkeleton";
import HorizontalCarousel from "../components/HorizontalCarousel";
import GroupsPost from "./GroupsPostFix";

interface User {
	id: number;
	userName: string;
	email: string;
	profilePic: string;
	role: string;
	isEnabled: boolean;
	username: string;
	authorities: { authority: string }[];
	isAccountNonLocked: boolean;
	isCredentialsNonExpired: boolean;
	isAccountNonExpired: boolean;
}

interface Group {
	id: number;
	name: string;
	description: string;
	isPrivate: boolean;
	user: User;
	picture: string;
	createdAt: string;
}

interface Post {
	id: number;
	user: User;
	group: Group;
	description: string;
	category: { id: number; description: string };
	picture: string;
	latitude: number;
	longitude: number;
	caption: string;
	createdAt: string;
	categoryId: number;
	userId: number;
	title: string;
}

const getDayWithSuffix = (date: Date) => {
	const day = date.getDate();
	const suffix =
		day % 10 === 1 && day !== 11 ? 'st' :
			day % 10 === 2 && day !== 12 ? 'nd' :
				day % 10 === 3 && day !== 13 ? 'rd' : 'th';
	return `${day}${suffix}`;
};

const GroupDetail: React.FC = () => {
	const userId = 2; // Hardcoded current user's ID as 2
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [group, setGroup] = useState<Group | null>(null);
	const [owner, setOwner] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [groupMembers, setMembers] = useState<User[]>([]);
	const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
	const [groupLoaded, setGroupLoaded] = useState(false);
	const [ownerLoaded, setOwnerLoaded] = useState(false);
	const [postsLoaded, setPostsLoaded] = useState(false);
	const [groupsLoaded, setGroupsLoaded] = useState(false);

	const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
	const defaultImage =
		"https://i.pinimg.com/originals/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg";

	// S3 States
	const [uploadedPictureUrl, setUploadedPictureUrl] = useState("");
	const [isUploadingPicture, setIsUploadingPicture] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
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
			setUploadedPictureUrl(imageUrl);
			setIsUploadingPicture(false);

			console.log("Image uploaded successfully.", imageUrl);

			// Update the group's picture in the backend
			await updateGroupPicture(imageUrl);
		} catch (error) {
			console.error("Error uploading file:", error);
			setIsUploadingPicture(false);
		}
	};

	const updateGroupPicture = async (pictureUrl: string) => {
		try {
			const response = await fetch(`/api/groups/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ ...group, picture: pictureUrl })
			});
			if (!response.ok) {
				throw new Error("Failed to update group picture");
			}
			// Update the group state with the new picture
			setGroup((prevGroup) =>
				prevGroup ? { ...prevGroup, picture: pictureUrl } : null
			);
		} catch (error) {
			console.error("Error updating group picture:", error);
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

	const handleImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}

	};

	if (!(groupLoaded && ownerLoaded && postsLoaded && groupsLoaded)) {
		return <GroupDetailSkeleton />;
	}


	return (

		<div className="relative">
			<div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-green-800 to-green-800 clip-path-custom-arch z-0"></div>
			<div className="container mx-auto p-4 relative z-10">
				<button
					onClick={() => navigate(-1)}
					className="absolute top-4 left-4 text-white hover:text-blue-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>
				<div className="text-center mb-4">
					<h1 className="text-2xl text-white font-bold mb-4">
						{group?.name}
					</h1>
					<div
						className="relative inline-block"
						style={{ width: "130px", height: "130px" }}
					>
						<img
							src={group?.picture || defaultImage}
							alt={`${group?.name} logo`}
							className="rounded-full mx-auto mb-4 cursor-pointer object-cover"
							style={{ width: "130px", height: "130px" }}
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
					</div>
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						ref={fileInputRef}
						style={{ display: "none" }}
					/>
					<p className="text-gray-600 text-sm mt-1">
						{group?.description}
					</p>
				</div>
				<div className="flex justify-center gap-1 mb-4">
					<button
						className={`px-4 py-2 rounded-full ${
							joinedGroups.includes(group?.id ?? 0)
								? "bg-gray-200 text-black border border-black-2"
								: "bg-green-800 text-white hover:bg-gray-700"
						} focus:outline-none focus:ring-2 focus:ring-gray-400`}
						onClick={() => handleJoinClick(group?.id ?? 0)}
					>
						{joinedGroups.includes(group?.id ?? 0)
							? "Leave this Group"
							: "Join this Group"}
					</button>
					<button
						onClick={() =>
							navigate("/groupMap", { state: { group, apicode } })
						}
						className="px-4 py-1 rounded-full bg-green-800 text-white border-black-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
					>
						View on Map
					</button>
				</div>

				<div className="flex justify-center items-center mb-8">
					<div className="flex flex-col items-center">
						<span className="text-gray-600">
							{posts.length} Posts
						</span>
					</div>
					<div className="w-px h-6 bg-gray-300 mx-4"></div>
					<div className="flex flex-col items-center">
						<span className="text-gray-600">7 Followers</span>
					</div>
				</div>

				<div className="flex justify-between items-center mb-4">
					<h1 className="text-xl font-bold">Posts in this group</h1>
					<Link
						to={`/group/${id}/posts`}
						className="text-sm text-black-200 underline"
					>
						View All
					</Link>
				</div>

				{posts.length === 0 ? (
					<div className="text-center">
						<img
							src="https://hub.securevideo.com/Resource/Permanent/Screencap/00/0000/000000/00000001/Screencap-173-020_42DE6C209630EC10647CDDB7D9F693FB77470D486D430F358FF1CB495B65BE55.png"
							alt="No posts"
							className="w-68 h-64 mx-auto mb-4"
						/>
						<p className="text-gray-600">
							There are no posts in this group yet. Be the first
							to post!
						</p>
					</div>
				) : (
					<HorizontalCarousel>
						{posts.map((post) => (
							<GroupsPost key={post.id} post={post} />
						))}
					</HorizontalCarousel>
				)}

				<div className="flex justify-between items-center mb-4 mt-4">
					<h1 className="text-xl font-bold">About the owner</h1>
					<Link
						to={`/profileView/${owner?.id}`}
						className="text-sm text-black-200 underline"
					>

						View their profile
					</Link>
				</div>
				<div className="mt-4 ml-4">
					<div className="flex items-center mb-4">

						<img
							src={owner?.picture || defaultImage}
							alt={owner?.userName}
							className="w-20 h-20 rounded-full mr-6"
						/>
						<div>
							<h2 className="text-lm font-bold">
								{owner?.userName || "No Name"}
							</h2>
							<p className="text-gray-600 text-sm">
								{owner?.email || "No Email"}
							</p>
							<p className="text-gray-600 text-sm">
								{owner?.role || "No Role"}
							</p>


						</div>
					</div>
				</div>
			</div>
		</div>

	);
};

export default GroupDetail;


