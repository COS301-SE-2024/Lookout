import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import HorizontalCarousel from './HorizontalCarousel';
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState("");
  const [editableDescription, setEditableDescription] = useState("");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await fetch(`/api/groups/${id}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const groupData = await groupResponse.json();
        
        // Assuming the groupData contains a userId but not a full user object
        let user = null;
        if (groupData.userId) {
          const userResponse = await fetch(`/api/users/${groupData.userId}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          });
          user = await userResponse.json();
        }
  
        // Combine groupData with fetched user
        const completeGroupData = { ...groupData, user };
        setGroup(completeGroupData);
        setOwner(user); // You can still set owner separately if needed
  
        const postsResponse = await fetch(`/api/posts/group/${id}?page=0&size=10`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const postsData = await postsResponse.json();
        setPosts(postsData.content);
  
       
        const memberResponse = await fetch(`/api/groups/users/${id}`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });
        const memberData = await memberResponse.json();
        setMembers(memberData);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };
  
    fetchGroupDetails();
  }, [id]);
  

  const handleRemoveMember = (userId: number) => {
    const requestBody = {
      groupId: group?.id,
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
  };


  const handleViewOnMapClick = () => {
    alert('View on the map button clicked!');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDoneClick = async () => {
    if (group) {
      // Create an updated post object with all required properties
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
        console.log(updatedGroup)
        const response = await fetch(`/api/groups/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedGroup),
        });

        console.log(response)

        if (!response.ok) {
          throw new Error("Failed to update group");
        }

        setGroup(updatedGroup);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating group:", error);
      }
    }

  };

  const handleCancelClick = () => {
    setEditableName(group?.name || "");
    setEditableDescription(group?.description || "");
    setIsEditing(false);
  };


  if (!group || !owner) {
    return <div>Loading...</div>;
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
              className="absolute top-4 right-6 text-white bg-green-800 hover:bg-white hover:text-green-800  border border-green-800 rounded-full px-4 py-2 cursor-pointer"
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
          />
        )}
        <div className="text-center mb-4">
          {isEditing ? (
            <textarea
              className="text-white text-xl w-80 rounded-full text-center bg-transparent"
              style={{ paddingTop: "10px" }}
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
            />
          ) : (
            <h1 className="text-2xl text-white font-bold mb-4">{group.name}</h1>
          )}
          {/* <h1 className="text-2xl text-white font-bold mb-4">{group.name}</h1> */}
          <img
            src={group.picture}
            alt={`${group.name} logo`}
            className="rounded-full mx-auto mb-4"
            style={{ width: '130px', height: '130px' }}
          />
          {isEditing ? (
            <textarea
              className="text-gray-600 text-sm w-80 rounded-full text-center bg-transparent"
              style={{ paddingTop: "10px" }}
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
            />

          ) : (
            <p className="text-gray-600 text-sm mt-1">{group.description}</p>)}
          {/* <p className="text-gray-600 text-sm mt-1">{group.description}</p> */}
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
          <h1 className="text-xl font-bold">Members in this group</h1>
          <Link to="/" className="text-sm text-black-200 underline">
            View all members
          </Link>
        </div>

        {/* Members Section */}
        {members && members.length > 0 ? (
          <div className="container mx-auto p-4">
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  className="flex items-center p-2 border rounded-lg shadow-sm group-item cursor-pointer hover:bg-gray-100"
                // onClick={() => handleMemberClick(member.id)}
                >
                  <div className="flex-shrink-0 w-12 h-full">
                    <img
                      src="https://i.pinimg.com/originals/d9/d8/8e/d9d88e3d1f74e2b8ced3df051cecb81d.jpg"
                      alt={`${group.name} logo`}
                      className="rounded-full w-12 h-12 mr-4" // Add mr-4 to add some space
                    />
                  </div>
                  <div className="flex-1 ml-3">
                    <div className="text-lg font-semibold">{member.userName || 'User'}</div>
                    {/* <p className="text-gray-600 text-xs mt-1">{member.email}</p> */}
                    <p className="text-gray-600 text-xs mt-1">A user about will be added soon</p>

                  </div>
                  <div className="flex items-center px-4 py-2 justify-center bg-green-800 text-white rounded-full hover:bg-green-600"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove this Member
                  </div>
                </div>
              ))}
            </div>
          </div>


        ) : (
          <div className="text-center">
            <img
              src="https://hub.securevideo.com/Resource/Permanent/Screencap/00/0000/000000/00000001/Screencap-173-020_42DE6C209630EC10647CDDB7D9F693FB77470D486D430F358FF1CB495B65BE55.png"
              alt="No members"
              className="w-68 h-64 mx-auto mb-4"
            />
            <p className="text-gray-600">There are no members in this group yet.</p>
          </div>
        )}


      </div>
    </div>
  );
};

export default CreatedGroupDetail;
