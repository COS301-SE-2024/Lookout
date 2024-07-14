import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: number;
  userName: string;
  email: string;
  passcode: string;
  role: string;
  isEnabled: boolean;
  password: string;
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
  user: User | null;
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
}

const GroupDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { group } = location.state as { group: Group };


  const [posts] = useState<Post[]>([]);

  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);


  useEffect(() => {
    const currentUserId = 2; // Placeholder user ID

    fetch(`/api/groups/user/${currentUserId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const isUserInGroup = data.some((userGroup: { id: number }) => userGroup.id === group.id);
        if (isUserInGroup) {
          setJoinedGroups((prevGroups) => [...prevGroups, group.id]);
        }
      })
      .catch((error) => console.error('Error checking group membership:', error));
  }, [group.id]);

  const handleJoinClick = (id: number) => {
    const apiUrl = joinedGroups.includes(id)
      ? '/api/groups/RemoveMemberFromGroup'
      : '/api/groups/AddMemberToGroup';

    const requestBody = {
      groupId: id,
      userId: 2, // PLaceholder id
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.status === 204) {
          if (joinedGroups.includes(id)) {
            setJoinedGroups(joinedGroups.filter((groupId) => groupId !== id));
          } else {
            setJoinedGroups([...joinedGroups, id]);
          }
        } else if (response.status === 400) {
          response.text().then((errorMessage) => {
            console.error(errorMessage);
          });
        } else {
          throw new Error('Failed to update group membership');
        }
      })
      .catch((error) => console.error('Error updating group membership:', error));
  };

  return (
    <div className="container mx-auto p-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700"
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
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{group.name}</h1>
        <img src={group.picture} alt={`${group.name} logo`} className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Created by: {group.user ? group.user.userName : 'No owner'}</h2>
        <p className="text-gray-600 mt-4">{group.description}</p>
      </div>
      <div className="text-center mt-4">
        <button
          className={`px-4 py-2 rounded-full ${
            joinedGroups.includes(group.id) ? 'bg-green-200 text-black border border-red-2' : 'bg-blue-500 text-white hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-gray-400`}
          onClick={() => handleJoinClick(group.id)}
        >
          {joinedGroups.includes(group.id) ? 'Joined' : 'Join'}
        </button>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Posts in this group</h2>
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
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{post.caption}</h3>
              {post.picture && <img src={post.picture} alt={post.caption} className="w-full h-auto mb-2 rounded" />}
              <p className="text-gray-700">{post.description}</p>
              <p className="text-gray-500 text-sm mt-2">Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDetail;
