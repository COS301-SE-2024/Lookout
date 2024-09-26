import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import GroupDetailSkeleton from "../components/GroupDetailSkeleton";
import HorizontalCarousel from "../components/HorizontalCarousel";
import GroupsPost from "./GroupsPostFix";
import AWS from "aws-sdk";

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
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
			? "nd"
			: day % 10 === 3 && day !== 13
			? "rd"
			: "th";
	return `${day}${suffix}`;
};

const GroupDetail: React.FC = () => {
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

	// State variables for image uploading
	const [isUploadingPicture, setIsUploadingPicture] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

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

	// Retrieve current user's email from localStorage
	const currentUserEmail = localStorage.getItem("userEmail");

	useEffect(() => {
		const fetchGroupDetails = async () => {
			try {
				const groupResponse = await fetch(`/api/groups/${id}`, {
					method: "GET",
					headers: { Accept: "application/json" }
				});
				const groupData = await groupResponse.json();
				setGroup(groupData);

				const userResponse = await fetch(`/api/users/`, {
					method: "GET",
					headers: { Accept: "application/json" }
				});
				const userData = await userResponse.json();
				setOwner(userData);
				setOwnerLoaded(true);

				const postsResponse = await fetch(
					`/api/posts/group/${id}?page=0&size=10`,
					{
						method: "GET",
						headers: { Accept: "application/json" }
					}
				);
				const postsData = await postsResponse.json();
				setPosts(postsData.content);
				setPostsLoaded(true);

				const userGroupsResponse = await fetch(`/api/groups/user`, {
					method: "GET",
					headers: { Accept: "application/json" }
				});
				const userGroupsData = await userGroupsResponse.json();
				const isUserInGroup = userGroupsData.some(
					(userGroup: { id: number }) => userGroup.id === Number(id)
				);
				if (isUserInGroup) {
					setJoinedGroups((prevGroups: any) => [
						...prevGroups,
						Number(id)
					]);
				}
				setGroupsLoaded(true);
				setGroupLoaded(true);

				const memberResponse = await fetch(`/api/groups/users/${id}`, {
					method: "GET",
					headers: { Accept: "application/json" }
				});
				const memberData = await memberResponse.json();
				const members = memberData.filter(
					(m: User) => m.id !== groupData.userId
				);
				setMembers(members);
			} catch (error) {
				console.error("Error fetching group details:", error);
				setGroupLoaded(true);
				setOwnerLoaded(true);
				setPostsLoaded(true);
				setGroupsLoaded(true);
			}
		};

		fetchGroupDetails();
	}, [id]);

	const handleJoinClick = (groupId: number) => {
		const apiUrl = joinedGroups.includes(groupId)
			? "/api/groups/RemoveMemberFromGroup"
			: "/api/groups/AddMemberToGroup";

		const requestBody = {
			groupId
		};

		fetch(apiUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody)
		})
			.then((response) => {
				if (response.status === 204) {
					setJoinedGroups((prevGroups) =>
						joinedGroups.includes(groupId)
							? prevGroups.filter((id) => id !== groupId)
							: [...prevGroups, groupId]
					);
				} else if (response.status === 400) {
					response
						.text()
						.then((errorMessage) => console.error(errorMessage));
				} else {
					throw new Error("Failed to update group membership");
				}
			})
			.catch((error) =>
				console.error("Error updating group membership:", error)
			);
	};

	const handleViewOnMapClick = () => {
		navigate(`/groupMap/${id}`);
	};

	// Functions for image uploading
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

			// Update the group's picture in the backend
			await updateGroupPicture(imageUrl);
		} catch (error) {
			console.error("Error uploading file:", error);
			setIsUploadingPicture(false);
		}
	};

	const updateGroupPicture = async (pictureUrl: string) => {
		try {
			const response = await fetch(`/api/groups/${id}/update-picture`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ newPictureUrl: pictureUrl })
			});
			if (!response.ok) {
				throw new Error("Failed to update group picture");
			}

			// Update the group picture in the state
			setGroup((prevGroup) => {
				if (prevGroup) {
					return { ...prevGroup, picture: pictureUrl };
				}
				return prevGroup;
			});
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
		<div className="p-4 scrollbar-hide flex flex-col min-h-screen bg-bkg ">
			<style>
				{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
			</style>
			<button
				onClick={() => navigate(-1)}
				className="absolute top-11 left-4 md:top-10 md:left-8 text-navBkg hover:text-icon z-50 rounded-full p-2"
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

			<div className="container mx-auto p-4 mt-10">
				<div className="flex flex-col md:flex-row md:items-center md:justify-center items-center">
					{/* Group Picture */}
					{owner?.email === currentUserEmail ? (
						<div
							className="relative group w-56 h-56 mb-4 md:mb-0 md:mr-8 cursor-pointer"
							onClick={handleImageClick}
						>
							<img
								className="w-full h-full object-cover"
								src={group?.picture}
								alt={`${group?.name} logo`}
								style={{ borderRadius: "8px" }}
							/>
							{isUploadingPicture && (
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg z-20">
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
							<>
								<div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg z-10">
									Change Group Picture
								</div>
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									ref={fileInputRef}
									style={{ display: "none" }}
								/>
							</>
						</div>
					) : (
						<div className="w-56 h-56 mb-4 md:mb-0 md:mr-8">
							<img
								className="w-full h-full object-cover"
								src={group?.picture}
								alt={`${group?.name} logo`}
								style={{ borderRadius: "8px" }}
							/>
						</div>
					)}

					<div className="text-center md:text-left flex flex-col items-center md:items-start">
						<h1 className="text-2xl md:text-4xl text-content font-bold mb-2">
							{group?.name}
						</h1>
						<p className="text-content md:text-xl text-md mb-2">
							{group?.description
								?.split(" ")
								.map((word, index) =>
									(index + 1) % 10 === 0
										? `${word} `
										: `${word} `
								)}
						</p>

						<div className="flex flex-col md:flex-row items-center mb-2">
							<div className="flex flex-row items-center">
								<span className="text-content md:text-xl text-md">
									{posts.length} Posts
								</span>
								<div className="w-px h-6 bg-gray-300 mx-2"></div>
								<span className="text-content md:text-xl text-md">
									{groupMembers.length} Members
								</span>
							</div>
						</div>

						<span className="text-content2 md:text-md text-base">
							{group?.createdAt
								? `${getDayWithSuffix(
										new Date(group.createdAt)
								  )} ${new Date(
										group.createdAt
								  ).toLocaleDateString("en-GB", {
										month: "long",
										year: "numeric"
								  })}`
								: "Unknown"}
						</span>

						<div className="flex gap-1 mt-4">
							<button
								onClick={handleViewOnMapClick}
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white rounded-lg px-4 py-2 md:text-md text-base"
							>
								View on map
							</button>
							<button
								className={`px-4 py-2 rounded-lg ${
									joinedGroups.includes(group?.id ?? 0)
										? "bg-gray-200 text-black border-gray-200 border rounded-lg md:text-md text-base hover:bg-white hover:text-navBkg hover:border-gray-300"
										: "bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white rounded-lg text-sm"
								}`}
								onClick={() => handleJoinClick(group?.id ?? 0)}
							>
								{joinedGroups.includes(group?.id ?? 0)
									? "Leave this Group"
									: "Join this Group"}
							</button>
						</div>
					</div>
				</div>
				<div className="mt-8">
					<div className="flex justify-between items-center mb-4">
						<h1 className="md:text-xl text-base font-bold ml-4">
							Posts in this group
						</h1>
						<Link
							to={`/group/${id}/posts`}
							className="md:text-base text text-content hover:text-gray-800 underline"
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
							<p className="text-content">
								There are no posts in this group yet. Be the
								first to post!
							</p>
						</div>
					) : (
						<HorizontalCarousel>
							{posts.map((post) => (
								<GroupsPost key={post.id} post={post} />
							))}
						</HorizontalCarousel>
					)}
				</div>

				<div className="flex justify-between items-center mb-4 mt-4 ml-4">
					<h1 className="md:text-xl text-base font-bold">
						About the owner
					</h1>
					<Link
						to={`/profileView/${owner?.id}`}
						className="md:text-base text text-content underline hover:text-gray-800"
					>
						View their profile
					</Link>
				</div>
				<div className="mt-4 ml-4">
					<div className="flex items-center mb-4">
						<img
							src={owner?.profilePic}
							alt=""
							className="w-20 h-20 rounded-full mr-6"
						/>
						<div>
							<h2 className="text-lm font-bold">
								{owner?.userName || "No Name"}
							</h2>
							<p className="text-content2 text-sm">
								{owner?.email || "No Email"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupDetail;
