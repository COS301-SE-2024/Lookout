import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryPill from "./CategoryPill";
import SkeletonPinDetail from "./PinDetailSkeleton";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import HorizontalCarousel from "../components/HorizontalCarousel";
import PinDetailPost from "./PinDetailPost";
import webSocketService from "../utils/webSocketService";

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
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [theme, setTheme] = useState("default");
	const [post, setPost] = useState<Post | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSaved, setIsSaved] = useState<boolean>(false);
	const [saves, setSaves] = useState<number>(0);
	const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
	const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	useEffect(() => {
		const localStoreTheme = localStorage.getItem("data-theme") || "default";
		setTheme(localStoreTheme);
	}, []);

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

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await fetch(`/api/posts/${id}`);
				if (!response.ok) {
					throw new Error("Failed to fetch post");
				}
				const data = await response.json();
				setPost(data);
				setLoading(false);

				// Fetch related posts once the main post is fetched
				const relatedResponse = await fetch(
					`/api/posts/group/${data.groupId}?page=0&size=10`
				);
				if (!relatedResponse.ok) {
					throw new Error("Failed to fetch related posts");
				}
				const relatedData = await relatedResponse.json();
				setRelatedPosts(relatedData.content);

				const userResponse = await fetch(`/api/users/`);
				if (!userResponse.ok) {
					throw new Error("Failed to fetch user data");
				}
				const userData = await userResponse.json();
				setUser(userData);
			} catch (error) {
				console.error("Error fetching post or related posts:", error);
				setLoading(false);
			}
		};

		const checkIfSaved = async () => {
			try {
				const response = await fetch(
					`/api/savedPosts/isPostSaved?postId=${id}`
				);
				if (!response.ok) {
					throw new Error("Failed to check if post is saved");
				}
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
				if (!response.ok) {
					throw new Error("Failed to fetch saves count");
				}
				const data = await response.json();
				setSaves(data);
			} catch (error) {
				console.error("Error fetching saves count:", error);
			}
		};

		fetchPost();
		checkIfSaved();
		getCountSaves();
	}, [id]);

	useEffect(() => {
		if (!post?.id) {
			return;
		}

		let subscription: any = null;

		webSocketService
			.connect(localStorage.getItem("authToken")!!)
			.then(() => {

				subscription = webSocketService.subscribe(
					`/post/${post.id}`,
					(message: any) => {
						

						try {
							const savedPostData = JSON.parse(message.body);

							// Check the user email instead of userId
							if (savedPostData.postId === post.id) {
								if (savedPostData.userEmail !== user?.email) {
									setSaves(savedPostData.saves);
								}
							}
						} catch (error) {
							console.error("Error parsing message:", error);
						}
					}
				);
			})
			.catch((error) => {
				console.error("WebSocket connection error:", error);
			});

		return () => {
			if (subscription) {
				webSocketService.unsubscribe(subscription);
			}
			webSocketService.disconnect();
		};
	}, [post?.id, user?.email]);

	const handleSaveClick = async () => {
		if (!post) return;

		setIsSaved(true);
		setSaves(saves + 1);

		const requestBody = {
			postId: post.id
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

			// Optionally, you can confirm the save was successful
		} catch (error) {
			console.error("Error saving post:", error);
			// Revert the optimistic update
			setIsSaved(false);
			setSaves(saves - 1);
			// Optionally, notify the user about the error
			alert("Failed to save the post. Please try again.");
		}
	};

	const handleUnsaveClick = async () => {
		if (!post) return;

		// Optimistically update the state
		setIsSaved(false);
		setSaves(saves - 1);

		const requestBody = {
			postId: post.id
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

			// Optionally, you can confirm the unsave was successful
		} catch (error) {
			console.error("Error unsaving post:", error);
			// Revert the optimistic update
			setIsSaved(true);
			setSaves(saves + 1);
			// Optionally, notify the user about the error
			alert("Failed to unsave the post. Please try again.");
		}
	};

	const handleSaveIconClick = () => {
		if (isSaved) {
			handleUnsaveClick();
		} else {
			handleSaveClick();
		}
	};

	if (loading) {
		return <SkeletonPinDetail />;
	}

	if (!post || !user) {
		return <SkeletonPinDetail />;
	}

	return (
		<div className="p-4 scrollbar-hide flex flex-col min-h-screen bg-bkg">
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
				className="absolute top-8 left-4 md:top-20 md:left-8 text-navBkg hover:text-icon z-50 mt-2 rounded-full p-2 "
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
			<div className="container mx-auto p-4 mt-16 lg:w-full xl:w-full h-full flex-grow">
				<div className="card bg-base-100 shadow-xl rounded-lg flex flex-col md:flex-row h-full min-h-[550px]">
					{/* Minimum height added */}
					<figure className="rounded-t-lg overflow-hidden md:w-1/2">
						<img
							src={post.picture}
							alt={post.title}
							className="w-full h-full object-cover"
						/>
					</figure>
					<div className="card-body p-4 md:w-1/2 flex flex-col justify-between flex-grow">
						{/* flex-grow added */}
						<div className="flex items-center justify-between mt-2 mb-4">
							<h1 className="text-2xl md:text-4xl font-bold">
								{post.title}
							</h1>
							<div className="flex items-center">
								{isSaved ? (
									<FaBookmark
										className="text-navBkg cursor-pointer"
										onClick={handleSaveIconClick}
										size={28} // Larger size
									/>
								) : (
									<FaRegBookmark
										className="text-navBkg cursor-pointer"
										onClick={handleSaveIconClick}
										size={28} // Larger size
									/>
								)}
								<span className="ml-2 md:text-xl text-base text-center">
									{saves} saves
								</span>
							</div>
						</div>
						<div className="flex items-center mb-4">
							<img
								src={post.profilePic}
								alt={post.username}
								className="w-20 h-20 md:w-24 md:h-24 rounded-full mr-4 object-cover"
							/>
							<div>
								<h2 className="text-content text-xl md:text-2xl font-bold">
									{post.username}
								</h2>
								<p className="text-content md:text-xl text-md">
									{post.caption}
								</p>
								<p className="text-content2 md:text-md text-base">
								{post.createdAt
									? `${getDayWithSuffix(new Date(post.createdAt))} ${new Date(post.createdAt).toLocaleDateString("en-GB", {
										month: "long",
										year: "numeric"
									})} at ${new Date(post.createdAt).toLocaleTimeString("en-GB", {
										hour: "2-digit",
										minute: "2-digit"
									})}`
									: "Unknown"}
								</p>

								<CategoryPill categoryId={post.categoryId} />


								
							</div>
						</div>
						<div className="flex justify-center mt-4 space-x-4">
							<button
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white md:text-xl rounded-lg px-4 py-2 text-ml"
								onClick={() =>
									navigate(`/map`, {
										state: { post, apicode }
									})
								}
							>
								View on Map
							</button>
							<button
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white md:text-xl rounded-lg px-4 py-2 text-ml"
								onClick={() =>
									navigate(`/group/${post?.groupId}`, {
										state: { group: post?.group }
									})
								}
							>
								View Group
							</button>
						</div>
						<div className="mt-8">
							<h1 className="text-lg font-semibold md:text-xl ">
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
