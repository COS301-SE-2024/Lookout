import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { FaCog } from "react-icons/fa";
import profilePhoto from "../assets/styles/images/mockprofilephoto.png";
import PostsGridFix from "../components/PostsGridFix";
import GroupsGridFix from "../components/GroupsGridFix";

interface User {
  id: number;
  userName: string;
  email: string;
  picture?: string;
  role: string;
  isEnabled: boolean;
  username: string;
  authorities: { authority: string }[];
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isAccountNonExpired: boolean;
}

const ProfileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // User ID from URL params
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const [groupsCount, setGroupsCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'posts' | 'groups'>('posts');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`/api/users/${id}`, {
          headers: { Accept: "application/json" },
        });
        console.log(userResponse)
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch posts count
        const postsCountResponse = await fetch(`/api/users/postsCount/${id}`, {
          headers: {
            Accept: "application/json"
          }
        });
        const postsCountData = await postsCountResponse.json();
        setPostsCount(postsCountData);

        // Fetch groups count
        const groupsCountResponse = await fetch(`/api/users/groupsCount/${id}`, {
          headers: {
            Accept: "application/json"
          }
        });
        const groupsCountData = await groupsCountResponse.json();
        setGroupsCount(groupsCountData);

        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setDataLoaded(true); // Even on error, set dataLoaded to true to stop loading screen
      }
    };

    fetchUserData();
  }, [id]);

  if (!dataLoaded) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="relative flex flex-col items-center w-full min-h-screen">
      {user ? (
        <>
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-green-800 hover:text-blue-700">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>
          <div className="mt-10 cursor-pointer">
            <img
              className="w-24 h-24 rounded-full bg-gray-300 mb-2 cursor-pointer"
              src={user.picture || profilePhoto}
              alt={`${user.userName}'s profile`}
            />
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-xl font-bold">{user.userName}</h1>
            {/* <p className="text-gray-600 text-sm">{user.email}</p> */}
            <p className="text-gray-600 text-sm">{user.role}</p>
          </div>

          {/* Followers and Following */}
          <div className="mt-2 text-center">
            <span className="font-bold">{postsCount}</span> posts |{" "}
            <span className="font-bold">{groupsCount}</span> groups
          </div>

          {/* Tabs */}
          <div className="w-full max-w-screen-lg mx-auto mt-4">
            <div className="flex justify-center">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 font-semibold ${activeTab === 'posts' ? 'border-b-2 border-green-800 text-green-800' : 'text-gray-600'}`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-4 py-2 font-semibold ${activeTab === 'groups' ? 'border-b-2 border-green-800 text-green-800' : 'text-gray-600'}`}
              >
                Groups
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'posts' ? (
                <PostsGridFix searchQuery="" /> // Adjust searchQuery as needed
              ) : (
                <GroupsGridFix searchQuery="" /> // Adjust searchQuery as needed
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mt-6">
          <p className="text-gray-600">User data could not be loaded.</p>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;
