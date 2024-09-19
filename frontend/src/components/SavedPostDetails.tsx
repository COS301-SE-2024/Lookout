import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryPill from "./CategoryPill";
import SkeletonPinDetail from "./PinDetailSkeleton";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import HorizontalCarousel from "../components/HorizontalCarousel";
import PinDetailPost from "./PinDetailPost";
import webSocketService from "../utils/websocketService";

interface Post {
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

const PinDetail: React.FC = () => {
	const userId = 1; // ADD IN FROM LOGIN LATER
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [theme, setTheme] = useState("default");
	const [post, setPost] = useState<Post | null>(null);
	const [loadingPost, setLoadingPost] = useState(true);
	const [loadingRelatedPost, setLoadingRelatedPost] = useState(true);
	const [loadingSaved, setLoadingSaved] = useState(true);
	const [loadingSaves, setLoadingSaves] = useState(true);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [saves, setSaves] = useState<number>(0);
	const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
	const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	// Fetch theme from local storage
	useEffect(() => {
		const localStoreTheme = localStorage.getItem("data-theme") || "default";
		setTheme(localStoreTheme);
	}, []);

	// Handle theme change
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "data-theme") {
				const newTheme =
					localStorage.getItem("data-theme") || "default";
				setTheme(newTheme);
				document.documentElement.setAttribute("data-theme", newTheme);
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	// Apply theme
	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	// Fetch post and related data from API
	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await fetch(`/api/posts/${id}`);
				const data = await response.json();
				setPost(data);
				setLoadingPost(false);

				const relatedResponse = await fetch(
					`/api/posts/group/${data.groupId}?page=0&size=10`
				);
				const relatedData = await relatedResponse.json();
				setRelatedPosts(relatedData.content);
				setLoadingRelatedPost(false);
			} catch (error) {
				console.error("Error fetching post or related posts:", error);
				setLoadingPost(false);
			}
		};

		const checkIfSaved = async () => {
			try {
				const response = await fetch(
					`/api/savedPosts/isPostSaved?userId=${userId}&postId=${id}`
				);
				const data = await response.json();
				setIsSaved(data);
				setLoadingSaved(false);
			} catch (error) {
				console.error("Error checking saved status:", error);
				setLoadingSaved(false);
			}
		};

		const getCountSaves = async () => {
			try {
				const response = await fetch(
					`/api/savedPosts/countSaves?postId=${id}`
				);
				const data = await response.json();
				setSaves(data);
				setLoadingSaves(false);
			} catch (error) {
				console.error("Error fetching saves count:", error);
				setLoadingSaves(false);
			}
		};

		fetchPost();
		checkIfSaved();
		getCountSaves();
	}, [id, userId]);

	useEffect(() => {
		const subscribeToWebSocket = async () => {
			try {
				await webSocketService.connect();
				console.log("Connected to WebSocket");

				// Subscribe to WebSocket messages for the specific post
				webSocketService.subscribe(
					`/topic/post/${id}`,
					(message: { body: string }) => {
						try {
							const updatedSaveData = JSON.parse(message.body);
							setSaves(updatedSaveData.saves);

							if (updatedSaveData.userId === userId) {
								setIsSaved(updatedSaveData.isSaved);
							}
						} catch (error) {
							console.error(
								"Failed to parse WebSocket message:",
								error
							);
						}
					}
				);
			} catch (error) {
				console.error("Error subscribing to WebSocket:", error);
			}
		};

		subscribeToWebSocket();

		return () => {
			webSocketService.disconnect();
		};
	}, [id, userId]);

	// Handle saving post
	const handleSaveClick = async () => {
		const requestBody = {
			userId,
			postId: post?.id
		};

		try {
			const response = await fetch("/api/savedPosts/SavePost", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
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

	// Handle unsaving post
	const handleUnsaveClick = async () => {
		const requestBody = {
			userId,
			postId: post?.id
		};

		try {
			const response = await fetch("/api/savedPosts/UnsavePost", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				},
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

	// Toggle save/unsave
	const handleSaveIconClick = () => {
		if (isSaved) {
			handleUnsaveClick();
		} else {
			handleSaveClick();
		}
	};

	// Wait for all data to load
	const allDataLoaded =
		!loadingPost && !loadingSaved && !loadingSaves && !loadingRelatedPost;

	if (!allDataLoaded) {
		return <SkeletonPinDetail />;
	}

	return (
		<div className="container mx-auto p-4 relative max-h-screen overflow-y-auto">
			{/* Button to go back */}
			<button
				onClick={() => navigate(-1)}
				className="absolute top-4 left-4 text-green-700 hover:text-green-500 z-50 mt-2"
				style={{ zIndex: 50 }}
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

			{/* Post details */}
			<div className="grid md:grid-cols-2 mt-10 relative">
				{/* Left Section (Image) */}
				<div className="rounded-l-lg">
					<img
						src={post?.picture}
						alt={post?.title}
						className="rounded-lg max-h-96 w-full object-cover object-center"
					/>
				</div>

				{/* Right Section (Post Content) */}
				<div className="p-4 flex flex-col">
					<h1 className="text-4xl font-bold">{post?.title}</h1>
					<p className="mt-4 text-lg">{post?.description}</p>

					{/* Category pill */}
					<div>
						<h2 className="text-lg font-bold">{post?.username}</h2>
						<p className="text-gray-600 text-sm">{post?.caption}</p>
						<CategoryPill categoryId={post?.categoryId} />
					</div>

					{/* Save Button */}
					<div className="mt-6 flex items-center">
						{isSaved ? (
							<FaBookmark
								className="text-4xl text-green-600 hover:text-green-400 cursor-pointer"
								onClick={handleSaveIconClick}
							/>
						) : (
							<FaRegBookmark
								className="text-4xl text-gray-500 hover:text-gray-300 cursor-pointer"
								onClick={handleSaveIconClick}
							/>
						)}
						<span className="ml-3 text-lg">{saves} Saves</span>
					</div>
				</div>
			</div>

			{/* Related Posts */}

			<HorizontalCarousel>
				{relatedPosts.map((relatedPost) => (
					<PinDetailPost key={relatedPost.id} post={relatedPost} />
				))}
			</HorizontalCarousel>
		</div>
	);
};

export default PinDetail;
