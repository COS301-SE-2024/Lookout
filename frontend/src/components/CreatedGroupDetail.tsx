import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import HorizontalCarousel from './HorizontalCarousel';
import { FaEdit } from 'react-icons/fa';
import GroupsPost from './GroupsPostFix';
import DOMPurify from 'dompurify';
import GroupDetailSkeleton from './GroupDetailSkeleton';

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

const CreatedGroupDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [groupMembers, setMembers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [editableName, setEditableName] = useState('');
  const [editableDescription, setEditableDescription] = useState('');

  // Modal State
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await fetch(`/api/groups/${id}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const groupData = await groupResponse.json();

        if (groupData.userId) {
          const userResponse = await fetch(`/api/users/`, {
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
        const members = memberData.filter((m: User) => m.id !== groupData.userId);
        setMembers(members);

      } catch (error) {
        console.error('Error fetching group details:', error);
        setGroupLoaded(true);
        setPostsLoaded(true);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleViewOnMapClick = () => {
    navigate(`/groupMap/${id}`);
  };

  // Open Modal
  const openRemoveModal = (member: User) => {
    setMemberToRemove(member);
    setShowRemoveModal(true);
  };

  // Confirm Removal
  const confirmRemoveMember = async () => {
    if (!group || !memberToRemove) return;

    try {
      const response = await fetch('/api/groups/RemoveMemberFromGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: group.id,
          userId: memberToRemove.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      setMembers(groupMembers.filter((m) => m.id !== memberToRemove.id));
      setShowRemoveModal(false);
      setMemberToRemove(null);
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member. Please try again.');
    }
  };

  // Close Modal
  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setMemberToRemove(null);
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

  const handleDeleteClick = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this group?");
    if (confirmed && group) {
      try {
        const response = await fetch(`/api/groups/${group.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete group');
        }

        // Navigate to home page after deletion
        navigate('/profile');
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  if (!group || !owner || !groupLoaded || !postsLoaded) {
    return <GroupDetailSkeleton />;
  }

  // Modal Component
  const RemoveMemberModal: React.FC<{ member: User; onConfirm: () => void; onCancel: () => void }> = ({ member, onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-navBkg bg-opacity-50 z-50">
      <div className="bg-bkg p-6 rounded-lg shadow-lg max-w-sm w-full text-white">
        <h2 className="text-content text-xl font-bold mb-4">Confirm Removal</h2>
        <p  className="text-content">Are you sure you want to remove <span className="font-semibold">{member.userName}</span> from the group?</p>
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={onCancel}
            className="mr-3 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg px-4 py-2 rounded"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 scrollbar-hide flex flex-col min-h-screen bg-bkg relative">
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

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-11 left-4 md:top-10 md:left-8 text-nav hover:text-icon z-50 rounded-full p-2"
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

      {/* Edit and Cancel/Done Buttons */}
      {isEditing ? (
        <>
          <button
            className="absolute top-20 right-6 text-white bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-full px-4 py-2 cursor-pointer md:top-24 md:right-28"
            onClick={handleDoneClick}
          >
            Done
          </button>
          <button
            className="absolute top-20 left-24 text-white bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-full px-4 py-2 cursor-pointer md:top-24 md:left-28"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <FaEdit
            className="absolute top-14 right-8 text-xl text-content cursor-pointer text-nav hover:text-icon md:top-10 md:right-8"
            onClick={handleEditClick}
            size={24}
          />
        </>
      )}

      <div className="container mx-auto p-4 mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center items-center">
          <img
            src={group.picture}
            alt={`${group.name} logo`}
            className="w-56 h-56 object-cover mb-4 md:mb-0 md:mr-8"
            style={{ borderRadius: '8px' }}
          />

          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            {isEditing ? (
              <input
                type="text"
                className="text-content text-2xl italic font-bold bg-transparent mb-2 border-b border-gray-300 focus:outline-none"
                value={editableName}
                onChange={(e) => setEditableName(DOMPurify.sanitize(e.target.value))}
              />
            ) : (
              <h1 className="text-2xl md:text-4xl text-content font-bold mb-2">{group.name}</h1>
            )}

            {isEditing ? (
              <input
                type="text"
                className="text-content md:text-xl text-md italic w-80 bg-transparent border-b border-gray-300 focus:outline-none mb-2"
                value={editableDescription}
                onChange={(e) => setEditableDescription(DOMPurify.sanitize(e.target.value))}
              />
            ) : (
              <p className="text-content md:text-xl text-base mb-2">
                {group?.description?.split(' ').map((word, index) =>
                  (index + 1) % 10 === 0 ? `${word} ` : `${word} `
                ).reduce<React.ReactNode[]>((acc, curr, index) => (
                  (index + 1) % 10 === 0 ? [...acc, curr, <br key={index} />] : [...acc, curr]
                ), [])}
              </p>
            )}

            <div className="flex flex-col md:flex-row items-center mb-2">
              <div className="flex flex-row items-center">
                <span className="text-content md:text-xl text-md">{posts.length} Posts</span>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <span className="text-content md:text-xl text-md">{groupMembers.length} Members</span>
              </div>
            </div>

            <span className="text-content2 md:text-md text-base">
              {group.createdAt ? (
                `${getDayWithSuffix(new Date(group.createdAt))} ${new Date(group.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`
              ) : 'Unknown'}
            </span>

            <div className="flex gap-1 mt-4">
              <button
                onClick={handleViewOnMapClick}
                className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-lg px-4 py-2 md:text-md text-base text-white"
              >
                View on map
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-lg px-4 py-2 md:text-md text-base text-white"
              >
                Delete group
              </button>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="md:text-xl text-base font-bold ml-4">Posts in this group</h1>
            <Link to={`/group/${id}/posts`} className="md:text-base text-sm text-content underline hover:text-gray-800">View All</Link>
          </div>
          <HorizontalCarousel>
            {posts.map((post) => (
              <GroupsPost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>
        </div>

        {/* About the Owner Section */}
        <div className="flex justify-between items-center mb-4 mt-4 ml-4">
          <h1 className="md:text-xl text-base font-bold">About the owner</h1>
          <Link to={`/profileView/${owner?.id}`} className="text-content md:text-base text-sm hover:text-gray-800 underline">
            View their profile
          </Link>
        </div>

        <div className="mt-4 ml-4">
          <div className="flex items-center mb-4">
            <img src={owner?.profilePic} alt="" className="w-20 h-20 rounded-full mr-6" />
            <div>
              <h2 className="text-content text-lg font-bold">{owner?.userName || 'No Name'}</h2>
              <p className="text-content text-sm">{owner?.email || 'No Email'}</p>
            </div>
          </div>
        </div>

        {/* Group Members List */}
<div className="mt-6 ml-4">
  <h2 className="md:text-xl text-base font-bold mb-2">Group Members</h2>
  <ul className="space-y-4">
    {groupMembers.map((member) => (
      <li key={member.id} className="flex items-center justify-between p-2 rounded-lg">
        <div className="flex items-center">
          <img
            src={member.profilePic}
            alt={`${member.userName}'s profile`}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <span className="text-lg font-bold">{member.userName}</span>
            <p className="md:text-sm text-xs text-content2">{member.email}</p>
          </div>
        </div>
        {/* Remove Member Button */}
        <button
    className="absolute right-4 bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-lg sm:px-2 px-4 py-2 md:text-sm text-xs text-white md:static md:ml-4" // md:static resets to normal flow on larger screens
    onClick={() => openRemoveModal(member)}
>
  Remove
</button>
      </li>
    ))}
  </ul>
</div>

      </div>

      {/* Render Modal */}
      {showRemoveModal && memberToRemove && (
        <RemoveMemberModal
          member={memberToRemove}
          onConfirm={confirmRemoveMember}
          onCancel={closeRemoveModal}
        />
      )}
    </div>
  );
};

export default CreatedGroupDetail;