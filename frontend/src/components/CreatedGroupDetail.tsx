import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import HorizontalCarousel from './HorizontalCarousel';
import CreatedGroupDetailSkeleton from '../components/CreatedGroupSkeleton';
import { FaEdit } from 'react-icons/fa';
import GroupsPost from './GroupsPostFix';

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

const CreatedGroupDetail: React.FC = () => {
  const userId = 1; // Placeholder for user ID
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [editableName, setEditableName] = useState('');
  const [editableDescription, setEditableDescription] = useState('');

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await fetch(`/api/groups/${id}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const groupData = await groupResponse.json();

        if (groupData.userId) {
          const userResponse = await fetch(`/api/users/${groupData.userId}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          });
          const user = await userResponse.json();
          groupData.user = user;
          setOwner(user);
        }

        setGroup(groupData);
        setGroupLoaded(true);

        const postsResponse = await fetch(`/api/posts/group/${id}?page=0&size=10`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const postsData = await postsResponse.json();
        setPosts(postsData.content);
        setPostsLoaded(true);

        const memberResponse = await fetch(`/api/groups/users/${id}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const memberData = await memberResponse.json();
        setMembers(memberData);
      } catch (error) {
        console.error('Error fetching group details:', error);
        setGroupLoaded(true);
        setPostsLoaded(true);

      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleRemoveMember = (userId: number) => {
    if (group) {
      const requestBody = {
        groupId: group.id,
        userId: userId,
      };

      fetch('/api/groups/RemoveMemberFromGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (response.ok) {
            setMembers((prevMembers) => prevMembers.filter((member) => member.id !== userId));
          } else {
            response.text().then((errorMessage) => console.error(errorMessage));
          }
        })
        .catch((error) => console.error('Error removing member:', error));
    }
  };

  const handleViewOnMapClick = () => {
    navigate(`/groupMap/${id}`);
  };

  const handleEditClick = () => {
    if (group) {
      setEditableName(group.name);
      setEditableDescription(group.description);
    }
    setIsEditing(true);
  };

  const handleDoneClick = async () => {
    if (group) {
      const updatedGroup: Group = {
        id: group.id,
        name: editableName || group.name,
        description: editableDescription || group.description,
        isPrivate: group.isPrivate,
        user: group.user,
        picture: group.picture,
        createdAt: group.createdAt,
      };

      try {
        const response = await fetch(`/api/groups/${group.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedGroup),
        });

        if (!response.ok) {
          throw new Error('Failed to update group');
        }

        setGroup(updatedGroup);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating group:', error);
      }
    }
  };

  const handleCancelClick = () => {
    if (group) {
      setEditableName(group.name);
      setEditableDescription(group.description);
    }
    setIsEditing(false);
  };

  if (!group || !owner || !groupLoaded || !postsLoaded ) {
    return <CreatedGroupDetailSkeleton />;
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-green-800 to-green-100 clip-path-custom-arch z-0"></div>
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
        {isEditing ? (
          <>
            <button
              className="absolute top-4 right-6 text-white bg-green-800 hover:bg-white hover:text-green-800 border border-green-800 rounded-full px-4 py-2 cursor-pointer"
              onClick={handleDoneClick}
            >
              Done
            </button>
            <button
              className="absolute top-4 left-6 text-green-800 bg-white border border-green-800 hover:bg-green-800 hover:text-white rounded-full px-4 py-2 cursor-pointer"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </>
        ) : (
          <FaEdit
            className="absolute top-4 right-4 text-xl text-green-700 cursor-pointer mr-3"
            onClick={handleEditClick}
            color='white'
            size={24}
          />
        )}
        <div className="text-center mb-4">
          {isEditing ? (
            <textarea
              className="text-white text-xl w-80 rounded-full text-center bg-transparent"
              style={{ paddingTop: '10px' }}
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
            />
          ) : (
            <h1 className="text-2xl text-white font-bold mb-4">{group.name}</h1>
          )}
          <img
            src={group.picture}
            alt={`${group.name} logo`}
            className="rounded-full mx-auto mb-4"
            style={{ width: '130px', height: '130px' }}
          />
          {isEditing ? (
            <textarea
              className="text-black text-sm w-80 rounded-full text-center bg-transparent"
              style={{ paddingTop: '10px' }}
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
            />
          ) : (
            <p className="text-gray-600 text-sm mt-1">{group.description}</p>
          )}
        </div>
        <div className="flex justify-center gap-1 mb-4">
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
          <Link to="/" className="text-green-800 hover:text-gray-600">
            View all
          </Link>
        </div>
        <HorizontalCarousel>
          {posts.map((post) => (
            <GroupsPost
              key={post.id}
              post={post}
            />
          ))}
        </HorizontalCarousel>
      </div>
    </div>
  );
};

export default CreatedGroupDetail;
