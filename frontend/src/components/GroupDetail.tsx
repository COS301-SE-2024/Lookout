import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
	const userId = 1;
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [group, setGroup] = useState<Group | null>(null);
	const [owner, setOwner] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
	const [groupLoaded, setGroupLoaded] = useState(false);
	const [ownerLoaded, setOwnerLoaded] = useState(false);
	const [postsLoaded, setPostsLoaded] = useState(false);
	const [groupsLoaded, setGroupsLoaded] = useState(false);
	const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	useEffect(() => {
		const fetchGroupDetails = async () => {
			try {
				const groupResponse = await fetch(`/api/groups/${id}`, {
					method: "GET",
					headers: { Accept: "application/json" }
				});
				const groupData = await groupResponse.json();
				setGroup(groupData);

				const userResponse = await fetch(`/api/users/${groupData.userId}`, {
					method: 'GET',
					headers: { 'Accept': 'application/json' },
				});
				const userData = await userResponse.json();
				setOwner(userData);
				setOwnerLoaded(true);

				const postsResponse = await fetch(`/api/posts/group/${id}?page=0&size=10`, {
					method: "GET",
					headers: { Accept: "application/json" }
				});
				const postsData = await postsResponse.json();
				setPosts(postsData.content);
				setPostsLoaded(true);

				const userGroupsResponse = await fetch(`/api/groups/user/${userId}`, {
					method: "GET",
					headers: { Accept: "application/json" }
				});
				const userGroupsData = await userGroupsResponse.json();
				const isUserInGroup = userGroupsData.some((userGroup: { id: number }) => userGroup.id === Number(id));
				if (isUserInGroup) {
					setJoinedGroups((prevGroups: any) => [...prevGroups, Number(id)]);
				}
				setGroupsLoaded(true);
				setGroupLoaded(true);
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
			groupId,
			userId: userId
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
					response.text().then((errorMessage) => console.error(errorMessage));
				} else {
					throw new Error("Failed to update group membership");
				}
			})
			.catch((error) => console.error("Error updating group membership:", error));
	};

	const handleViewOnMapClick = () => {
		navigate(`/groupMap/${id}`);
	};

	if (!(groupLoaded && ownerLoaded && postsLoaded && groupsLoaded)) {
		return <GroupDetailSkeleton />;
	}


	return (
		<div className="p-4 scrollbar-hide">
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
				className="absolute top-14 left-4 md:top-20 md:left-8 text-green-700 hover:text-gray-800 z-50 rounded-full p-2"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-8 w-8"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<div className="container mx-auto p-4 mt-10">
				<div className="flex flex-col md:flex-row md:items-center md:justify-center items-center">

					<img
						src={group?.picture}
						alt={`${group?.name} logo`}
						className="w-56 h-56 object-cover mb-4 md:mb-0 md:mr-8"
						style={{ borderRadius: '8px' }}
					/>

					<div className="text-center md:text-left flex flex-col items-center md:items-start">
						<h1 className="text-2xl text-content font-bold mb-2">{group?.name}</h1>
						<p className="text-content text-ml mb-2">
							{group?.description?.split(' ').map((word, index) =>
								(index + 1) % 10 === 0 ? `${word} ` : `${word} `
							).reduce<React.ReactNode[]>((acc, curr, index) => (
								(index + 1) % 10 === 0 ? [...acc, curr, <br key={index} />] : [...acc, curr]
							), [])}
						</p>


						<div className="flex flex-col md:flex-row items-center mb-2">
							<div className="flex flex-row items-center">
								<span className="text-content text-sm">{posts.length} Posts</span>
								<div className="w-px h-6 bg-gray-300 mx-2"></div>
								<span className="text-content text-sm">7 Followers</span>
							</div>
						</div>

						<span className="text-gray-500 text-sm">

							{group?.createdAt ? (
								`${getDayWithSuffix(new Date(group.createdAt))} ${new Date(group.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`
							) : 'Unknown'}
						</span>


						<div className="flex gap-1 mt-4">
							<button
								onClick={handleViewOnMapClick}
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white rounded-lg px-4 py-2 text-sm"
							>
								View on map
							</button>
							<button
								className={`px-4 py-2 rounded-lg ${joinedGroups.includes(group?.id ?? 0)
										? "bg-gray-200 text-black border-gray-200 border rounded-lg text-sm hover:bg-gray-300 hover:border-gray-300"
										: "bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white rounded-lg text-sm"
									}`}
								onClick={() => handleJoinClick(group?.id ?? 0)}
							>
								{joinedGroups.includes(group?.id ?? 0) ? "Leave this Group" : "Join this Group"}
							</button>

						</div>

					</div>
				</div>

				<div className="mt-8">
					<div className="flex justify-between items-center mb-4">
						<h1 className="text-lm font-bold ml-4">Posts in this group</h1>
						<Link to={`/group/${id}/posts`} className="text-sm text-navBkg hover:text-gray-800 underline">View All</Link>
					</div>
					{posts.length === 0 ? (
						<div className="text-center">
							<img src="https://hub.securevideo.com/Resource/Permanent/Screencap/00/0000/000000/00000001/Screencap-173-020_42DE6C209630EC10647CDDB7D9F693FB77470D486D430F358FF1CB495B65BE55.png" alt="No posts" className="w-68 h-64 mx-auto mb-4" />
							<p className="text-gray-600">There are no posts in this group yet. Be the first to post!</p>
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
					<h1 className="text-ml font-bold">About the owner</h1>
					<Link to={`/profileView/${owner?.id}`} className="text-sm text-navBkg underline hover:text-gray-800">
						View their profile
					</Link>
				</div>
				<div className="mt-4 ml-4">
					<div className="flex items-center mb-4">
						<img src={owner?.profilePic} alt="" className="w-20 h-20 rounded-full mr-6" />
						<div>
							<h2 className="text-lm font-bold">{owner?.userName || 'No Name'}</h2>
							<p className="text-gray-600 text-sm">{owner?.email || 'No Email'}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

	);
};

export default GroupDetail;


