import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryPill from "./CategoryPill";
import SkeletonPinDetail from "./PinDetailSkeleton";
import { FaBookmark, FaRegBookmark, FaEdit } from "react-icons/fa";
import HorizontalCarousel from "../components/HorizontalCarousel";
import PinDetailPost from "./PinDetailPost";
import DOMPurify from "dompurify";

interface Post {
	profilePic: string | undefined;
	id: number;
	username: string;
	description: string;
	groupName: string;
	groupDescription: string;
	categoryId: any;
	groupId: number;
	title: string;
	groupPicture: string;
	admin: string;
	userId: number;
	user: {
		userId: number;
		userName: string;
		email: string;
		passcode: string;
		role: string;
		username: string;
		authorities: { authority: string }[];
		isCredentialsNonExpired: boolean;
		isAccountNonExpired: boolean;
		isAccountNonLocked: boolean;
		password: string;
		isEnabled: boolean;
	};
	group: {
		id: number;
		name: string;
		description: string;
		isPrivate: boolean;
		userId: number;
		username: string;
		user: {
			email: string;
			passcode: string;
			role: string;
			username: string;
			authorities: { authority: string }[];
			isCredentialsNonExpired: boolean;
			isAccountNonExpired: boolean;
			isAccountNonLocked: boolean;
			password: string;
			isEnabled: boolean;
		};
		picture: string;
		createdAt: string;
	};
	category: { id: number; description: string };
	picture: string;
	latitude: number;
	longitude: number;
	caption: string;
	createdAt: string;
}

interface User {
	userName: string;
	email: string;
	passcode: string;
	role: string;
	isEnabled: boolean;
	password: string;
	username: string;
	profilePic: string;
	authorities: { authority: string }[];
	isAccountNonLocked: boolean;
	isCredentialsNonExpired: boolean;
	isAccountNonExpired: boolean;
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

const PinDetail: React.FC = () => {
	const userId = 1;
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [theme, setTheme] = useState("light");
	const [post, setPost] = useState<Post | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [saves, setSaves] = useState<number>(0);
	const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editableTitle, setEditableTitle] = useState("");
	const [editableCaption, setEditableCaption] = useState("");
	const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	useEffect(() => {
		const localStoreTheme = localStorage.getItem("data-theme") || "light";
		setTheme(localStoreTheme);
	}, []);

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "data-theme") {
				const newTheme = localStorage.getItem("data-theme") || "light";
				setTheme(newTheme);
				document.documentElement.setAttribute("data-theme", newTheme);
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await fetch(`/api/posts/${id}`);
				const data = await response.json();
				setPost(data);
				setEditableTitle(data.title);
				setEditableCaption(data.caption);

				const relatedResponse = await fetch(
					`/api/posts/group/${data.groupId}?page=0&size=10`
				);
				const relatedData = await relatedResponse.json();
				setRelatedPosts(relatedData.content);

				// Fetch user details using post.userId
				const userResponse = await fetch(`/api/users/`);
				const userData = await userResponse.json();
				setUser(userData); // Store user data including profile picture
			} catch (error) {
				console.error("Error fetching post or related posts:", error);
			} finally {
				setLoading(false);
			}
		};

		const checkIfSaved = async () => {
			try {
				const response = await fetch(
					`/api/savedPosts/isPostSaved?userId=${userId}&postId=${id}`
				);
				const data = await response.json();
				setIsSaved(data);
			} catch (error) {
				console.error("Error checking saved status:", error);
			}
		};

		const getCountSaves = async () => {
			try {
				const response = await fetch(
					`/api/savedPosts/countSaves?postId=${id}`
				);
				const data = await response.json();
				setSaves(data);
			} catch (error) {
				console.error("Error fetching saves count:", error);
			}
		};

		fetchPost();
		checkIfSaved();
		getCountSaves();
	}, [id, userId]);

	const handleSaveClick = async () => {
		const requestBody = { userId, postId: post?.id };

		try {
			const response = await fetch("/api/savedPosts/SavePost", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error("Failed to save post");
			}

			setIsSaved(true);
			setSaves((prevSaves) => prevSaves + 1);
		} catch (error) {
			console.error("Error saving post:", error);
		}
	};

	const handleUnsaveClick = async () => {
		const requestBody = { userId, postId: post?.id };

		try {
			const response = await fetch("/api/savedPosts/UnsavePost", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody)
			});

			if (!response.ok) {
				throw new Error("Failed to unsave post");
			}

			setIsSaved(false);
			setSaves((prevSaves) => prevSaves - 1);
		} catch (error) {
			console.error("Error unsaving post:", error);
		}
	};

	const handleSaveIconClick = () => {
		if (isSaved) {
			handleUnsaveClick();
		} else {
			handleSaveClick();
		}
	};

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleDoneClick = async () => {
		if (post) {
			const updatedPost: Post = {
				...post,
				title: editableTitle,
				caption: editableCaption
			};

			try {
				const response = await fetch("/api/posts/UpdatePost", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedPost)
				});

				if (!response.ok) {
					throw new Error("Failed to update post");
				}

				setPost(updatedPost);
				setIsEditing(false);
			} catch (error) {
				console.error("Error updating post:", error);
			}
		}
	};

	const handleCancelClick = () => {
		setEditableTitle(post?.title || "");
		setEditableCaption(post?.caption || "");
		setIsEditing(false);
	};

	const handleDeleteClick = async () => {
		try {
			const response = await fetch(`/api/posts/${post?.id}`, {
				method: "DELETE"
			});

			if (!response.ok) {
				throw new Error("Failed to delete post");
			}

			navigate(-1); // Go back after deleting
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	if (loading) {
		return <SkeletonPinDetail />;
	}

	if (!post) {
		return <p>Post not found.</p>;
	}
	return (
		<div className="p-4 scrollbar-hide flex flex-col min-h-screen bg-bkg">
			{" "}
			{/* Ensure the container fills the whole screen */}
			<style>
				{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .search-results-container {
            display: grid;
            gap: 16px;
            justify-items: start;
          }
          .search-results-container .search-result-card {
            width: 100%;
            margin: 0;
          }
          @media (min-width: 768px) {
            .search-results-container {
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            }
          }
          @media (max-width: 767px) {
            .search-results-container {
              grid-template-columns: 1fr;
            }
            .search-bar {
              width: 100%;
            }
          }
        `}
			</style>
			<button
				onClick={() => navigate(-1)}
				className="z-30 absolute top-8 left-4 md:top-20 md:left-8 text-navBkg hover:text-icon  mt-2 rounded-full p-2"
				style={{ zIndex: 30 }}
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
			{isEditing ? (
				<>
					<button
						className="z-40 absolute top-12 right-6 text-white bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-full px-4 py-2 cursor-pointer md:top-24 md:right-28"
						onClick={handleDoneClick}
					>
						Done
					</button>
					<button
						className="z-40 absolute top-12 left-4 md:left-24 text-white bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-full px-4 py-2 cursor-pointer md:top-24 md:left-28"
						onClick={handleCancelClick}
						style={{ zIndex: 40 }}
					>
						Cancel
					</button>
				</>
			) : (
				<FaEdit
					className="absolute top-12 right-8 text-xl cursor-pointer text-navBkg md:top-24 md:right-8 hover:text-icon"
					onClick={handleEditClick}
					size={30}
				/>
			)}
			<div className="container mx-auto p-4 mt-16 lg:w-full xl:w-full h-full flex-grow">
				<div className="card bg-base-100 shadow-xl rounded-lg flex flex-col md:flex-row h-full min-h-[550px]">
					{" "}
					{/* Minimum height added */}
					<figure className="rounded-t-lg overflow-hidden md:w-1/2">
						<img
							src={post.picture}
							alt={post.title}
							className="w-full h-full object-cover"
						/>
					</figure>
					<div className="card-body p-4 md:w-1/2 flex flex-col justify-between flex-grow">
						{" "}
						{/* flex-grow added */}
						<div className="flex items-center justify-between mt-2 mb-4">
							{isEditing ? (
								<input
									type="text"
									className="text-2xl md:text-4xl font-bold italic bg-bkg w-full"
									value={editableTitle}
									onChange={(e) =>
										setEditableTitle(
											DOMPurify.sanitize(e.target.value)
										)
									}
								/>
							) : (
								<h1 className="text-2xl md:text-4xl font-bold">
									{post.title}
								</h1>
							)}
							<div className="flex items-center">
								{isSaved ? (
									<FaBookmark
										className="text-navBkg cursor-pointer"
										onClick={handleSaveIconClick}
										size={24}
									/>
								) : (
									<FaRegBookmark
										className="text-navBkg cursor-pointer"
										onClick={handleSaveIconClick}
										size={24}
									/>
								)}
								<span className="ml-2 md:text-xl text-base text-center">
									{saves} saves
								</span>
							</div>
						</div>
						<div className="flex items-center mb-6">
							<img
								src={post.profilePic}
								alt={post.username}
								className="w-20 h-20 md:w-24 md:h-24 rounded-full mr-4 object-cover"
							/>
							<div>
								<h2 className="text-content text-xl md:text-2xl font-bold">
									{post.username}
								</h2>

								{isEditing ? (
									<input
										type="text"
										className="text-content md:text-xl text-md italic resize-none bg-bkg w-full"
										value={editableCaption}
										onChange={(e) =>
											setEditableCaption(
												DOMPurify.sanitize(
													e.target.value
												)
											)
										}
									/>
								) : (
									<p className="text-content md:text-xl text-md">
										{post.caption}
									</p>
								)}

								<p className="text-content2 md:text-md text-base">
									{post.createdAt
										? `${getDayWithSuffix(
												new Date(post.createdAt)
										  )} ${new Date(
												post.createdAt
										  ).toLocaleDateString("en-GB", {
												month: "long",
												year: "numeric"
										  })} at ${new Date(
												post.createdAt
										  ).toLocaleTimeString("en-GB", {
												hour: "2-digit",
												minute: "2-digit"
										  })}`
										: "Unknown"}
								</p>

								<CategoryPill categoryId={post.categoryId} />
							</div>
						</div>
						<div className="flex justify-center mt-6 space-x-2">
							<button
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white md:text-lg rounded-lg md:px-4 md:py-2 px-2 py-1 text-sm"
								onClick={() =>
									navigate(`/map`, {
										state: { post, apicode }
									})
								}
							>
								View on Map
							</button>
							<button
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white md:text-lg rounded-lg md:px-4 md:py-2 px-2 py-1 text-sm"
								onClick={() =>
									navigate(`/group/${post.groupId}`, {
										state: { group: post.group }
									})
								}
							>
								View Group
							</button>
							{isEditing && (
								<button
									className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white md:text-xl rounded-lg md:px-4 md:py-2 px-2 py-1 text-sm"
									onClick={handleDeleteClick}
								>
									Delete Post
								</button>
							)}
						</div>
						<div className="mt-10">
							<h1 className="text-lg md:text-xl font-semibold">
								See more posts like this:
							</h1>

							<HorizontalCarousel>
								{relatedPosts.map((relatedPost) => (
									<PinDetailPost
										key={relatedPost.id}
										post={relatedPost}
									/>
								))}
							</HorizontalCarousel>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PinDetail;
