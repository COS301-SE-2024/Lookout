import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import HorizontalCarousel from '../components/HorizontalCarousel';
import GroupsPost from './GroupsPostFix';

interface User {
  id: number;
  userName: string;
  email: string;

  picture ?: string;
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
  user: User; // Adjusted to match the API response
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

const GroupDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const currentUserId = 2; // Placeholder user ID

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await fetch(`/api/groups/${id}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        const groupData = await groupResponse.json();
        setGroup(groupData);

        // Fetch user details after fetching group details
        const userResponse = await fetch(`/api/user/${groupData.userId}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        const userData = await userResponse.json();
        setOwner(userData);

        // Fetch posts in the group
        const postsResponse = await fetch(`/api/posts/group/${id}?page=0&size=10`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        const postsData = await postsResponse.json();
        setPosts(postsData.content);

        // Check if user is already in the group
        const userGroupsResponse = await fetch(`/api/groups/user/${currentUserId}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        const userGroupsData = await userGroupsResponse.json();
        const isUserInGroup = userGroupsData.some((userGroup: { id: number }) => userGroup.id === Number(id));
        if (isUserInGroup) {
          setJoinedGroups((prevGroups: any) => [...prevGroups, Number(id)]);
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleJoinClick = (groupId: number) => {
    const apiUrl = joinedGroups.includes(groupId)
      ? '/api/groups/RemoveMemberFromGroup'
      : '/api/groups/AddMemberToGroup';

    const requestBody = {
      groupId,
      userId: currentUserId,
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.status === 204) {
          setJoinedGroups((prevGroups) =>
            joinedGroups.includes(groupId) ? prevGroups.filter((id) => id !== groupId) : [...prevGroups, groupId]
          );
        } else if (response.status === 400) {
          response.text().then((errorMessage) => console.error(errorMessage));
        } else {
          throw new Error('Failed to update group membership');
        }
      })
      .catch((error) => console.error('Error updating group membership:', error));
  };

  const handleViewOnMapClick = () => {
    alert('View on the map button clicked!');
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  if (!group || !owner) {
    return <div>Loading...</div>;
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center mb-4">
          <h1 className="text-2xl text-white font-bold mb-4">{group.name}</h1>
          <img
            src={group.picture}
            alt={`${group.name} logo`}
            className="rounded-full mx-auto mb-4"
            style={{ width: '130px', height: '130px' }}
          />
          <p className="text-gray-600 text-sm mt-1">{group.description}</p>
        </div>
        <div className="flex justify-center gap-1 mb-4">
          <button
            className={`px-4 py-2 rounded-full ${joinedGroups.includes(group.id) ? 'bg-gray-200 text-black border border-black-2' : 'bg-green-800 text-white hover:bg-gray-700'} focus:outline-none focus:ring-2 focus:ring-gray-400`}
            onClick={() => handleJoinClick(group.id)}
          >
            {joinedGroups.includes(group.id) ? 'Leave this Group' : 'Join this Group'}
          </button>
          <button
            onClick={handleViewOnMapClick}
            className="px-4 py-1 rounded-full bg-green-800 text-white border-black-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            View on Map
          </button>
        </div>

        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-col items-center">
            <span className="text-gray-600">{posts.length} Posts</span>
          </div>
          <div className="w-px h-6 bg-gray-300 mx-4"></div>
          <div className="flex flex-col items-center">
            <span className="text-gray-600">7 Followers</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Posts in this group</h1>
          <Link to="/" className="text-sm text-black-200 underline">
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
            <p className="text-gray-600">There are no posts in this group yet. Be the first to post!</p>
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
          <Link to="/" className="text-sm text-black-200 underline">
            View their profile
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex items-center mb-4">
            <img
              src="https://i.pinimg.com/originals/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg"
              alt={owner.userName}
              className="w-20 h-20 rounded-full mr-6"
            />
            <div>
              <h2 className="text-lm font-bold">{owner.userName || 'No Name'}</h2>
              <p className="text-gray-600 text-sm">{owner.email || 'No Email'}</p>
              <p className="text-gray-600 text-sm">{owner.role || 'No Role'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
