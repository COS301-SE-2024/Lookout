import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Post {
  id: number;
  user: {
    id: number;
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
    user: {
      id: number;
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

const UserPostDetails = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id)
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [editableCaption, setEditableCaption] = useState<string>(''); // State for editable caption
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    fetch(`/api/posts/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setPost(data);
        setEditableCaption(data.caption); // Set initial editable caption
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Disable edit mode and reset editable caption
    setEditableCaption(post ? post.caption : ''); // Reset editable caption to original value
  };

  const handleSaveEdit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/posts/UpdatePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: post?.id,
          userId: post?.user.id,
          groupId: post?.group.id,
          categoryId: post?.category.id,
          picture: post?.picture,
          latitude: post?.latitude,
          longitude: post?.longitude,
          caption: editableCaption, // Send updated caption
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update caption');
      }

      const updatedPost = await response.json();
      setPost(updatedPost); // Update post with new data from server
      setIsEditing(false); // Disable edit mode
      setIsLoading(false);
    } catch (error:any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

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

      <div className="flex justify-center items-center">
        <p className="text-2xl font-bold mb-2">{post.category.description}</p>
      </div>
  
        
      <div className="flex justify-center items-center">
        <img src={post.picture} alt={`${post.caption} logo`} className="w-full rounded-lg mb-4" />
      </div>

      <div className="text-center mb-4">
      <p className="text-gray-700">{post.category.description}</p>
      <p className="text-gray-500 text-sm mt-2">Posted by: {post.user.username}</p>
      <p className="text-gray-500 text-sm mt-2">Group: {post.group.name}</p>
      <p className="text-gray-500 text-sm mt-2">Group description: {post.group.description}</p>
      </div>
     

      {!isEditing ? (
        <div className="flex justify-center items-center text-center">
          <p>{post.caption}</p>
          <button
            onClick={handleEditClick}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center text-center">
          <textarea
            value={editableCaption}
            onChange={(e) => setEditableCaption(e.target.value)}
            className="w-full rounded-lg mb-4"
          />
          <div className="flex justify-center items-center">
            <button
              onClick={handleSaveEdit}
              className="mr-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UserPostDetails;
