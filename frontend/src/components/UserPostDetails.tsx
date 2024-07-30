import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface Post {
  id: number;
  userid: number; 
  groupid: number; 
  categoryid: number; 
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  title: string;
}

const UserPostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const userId = 1;
  const postId = Number(id);
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [editableCaption, setEditableCaption] = useState<string>(''); 
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    fetch(`/api/image/${postId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data) { 
          setPost(data);
          setEditableCaption(data.caption); 
        } else {
          setError('Failed to load post data.');
        }
      })
      .catch(error => {
        console.error('Error fetching post:', error);
        setError('Error fetching post data.');
      });
  }, [postId]);

  const handleDeleteClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/image/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setIsLoading(false);
      navigate('/profile', { state: { message: 'Post was successfully deleted' } });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableCaption(post ? post.caption : ''); 
  };

  const handleSaveEdit = async () => {

    console.log('handleSaveEdit called'); 
  
  if (!post) {
    setError('Post data is not loaded yet.');
    return;
  }


  console.log("id: ", post?.id)
  console.log("userId: ", userId)
  console.log("groupId: ", post?.groupid)
  console.log("categoryId: ", post?.categoryid)
  console.log("picture: ", post?.picture)
  console.log("latitude: ", post?.latitude)
  console.log("longitude: ", post?.longitude)
  console.log("caption: ", editableCaption)
  console.log("title: ", post?.title)

    setIsLoading(true);
    try {
      const requestBody = {
        caption: editableCaption,
      };
  
      console.log('Request Body:', requestBody);
  
      const response = await fetch(`/api/image/update/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
  
      const updatedPost: Post = await response.json();
      console.log(updatedPost)
  
      if (!updatedPost || !updatedPost.id) {
        throw new Error('Invalid post structure received from the server');
      }
  
      console.log("updated post success", updatedPost);
      setPost(updatedPost); 
      setIsEditing(false); 
      setIsLoading(false);
    } catch (error: any) {
      console.log("updated post error", error);
      setError(error.message);
      setIsEditing(false); 
      setIsLoading(false);
    }
  };
  
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <button
        onClick={() => navigate('/profile')}
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
        <p className="text-2xl font-bold mb-2">{post.caption}</p>
      </div>
  
      <div className="flex justify-center items-center">
        <img src={`data:image/png;base64,${post.picture}`} alt={`${post.caption} logo`} className="w-full rounded-lg mb-4" />
      </div>

      <div className="text-center mb-4">
        {/* <p className="text-gray-700">{post.description}</p>
        <p className="text-gray-500 text-sm mt-2">Posted by: {post.username}</p>
        <p className="text-gray-500 text-sm mt-2">Group: {post.groupName}</p>
        <p className="text-gray-500 text-sm mt-2">Group description: {post.groupDescription}</p> */}
        <p className="text-gray-500 text-sm mt-2">Title: {post.title}</p>
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
      <br/>
      <div className="flex justify-center items-center text-center">
        <button
          onClick={handleDeleteClick}
          className="mr-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Delete
        </button>
      </div>

      <h2>View it on the map below:</h2>
     
      <APIProvider apiKey={apicode || ''} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={12}
          defaultCenter={{ lat: post.latitude, lng: post.longitude }}
          mapId="your-map-id"
          style={{ height: '300px', width: '100%' }}
        >
          <Marker position={{ lat: post.latitude, lng: post.longitude }} />
        </Map>
      </APIProvider>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UserPostDetails;

