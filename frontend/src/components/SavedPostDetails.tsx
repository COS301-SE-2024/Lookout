import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
interface Post {
  id: number;
  username: string;
  description: string;
  groupName: string;
  groupDescription: string;
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

const SavedPostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [editableCaption, setEditableCaption] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(true); // Assuming the post is initially saved
  const [userId] = useState<number>(2);
  const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    fetch(`/api/posts/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        setPost(data);
        setEditableCaption(data.caption);
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/savedPosts/SavePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { id: post?.user.id },
          post: { id: post?.id, picture: post?.picture }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save post: ${errorText}`);
      }
      
      setIsSaved(true);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleUnsaveClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/savedPosts/UnsavePost?userId=${userId}&postId=${post?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unsave post');
      }

      setIsSaved(false);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
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
          caption: editableCaption,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update caption');
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsEditing(false);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

//   return (
//     <div className="container mx-auto p-4 relative">
//       <button
//         onClick={() => navigate('/profile')}
//         className="absolute top-4 left-4 text-blue-500 hover:text-blue-700"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-8 w-8"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//         </svg>
//       </button>

//       <div className="flex justify-center items-center">
//         <p className="text-2xl font-bold mb-2">{post.caption}</p>
//       </div>

//       <div className="flex justify-center items-center">
//         <img src={post.picture} alt={`${post.caption} logo`} className="w-full rounded-lg mb-4" />
//       </div>

//       <div className="text-center mb-4">
//         {/* <p className="text-gray-700">{post.category.description}</p> */}
//         <p className="text-gray-500 text-sm mt-2">Posted by: {post.user.username}</p>
//         <p className="text-gray-500 text-sm mt-2">Group: {post.group.name}</p>
       
//       </div>

//       {!isEditing ? (
//         <div className="flex justify-center items-center text-center">
//           <p>{post.caption}</p>
//           <button
//             onClick={handleEditClick}
//             className="ml-2 text-blue-500 hover:text-blue-700"
//           >
//             Edit
//           </button>
//         </div>
//       ) : (
//         <div className="flex justify-center items-center text-center">
//           <textarea
//             value={editableCaption}
//             onChange={(e) => setEditableCaption(e.target.value)}
//             className="w-full rounded-lg mb-4"
//           />
//           <div className="flex justify-center items-center">
//             <button
//               onClick={handleSaveEdit}
//               className="mr-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleCancelEdit}
//               className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//       <br />
//       <div className="flex justify-center items-center text-center">
//         <button
//           onClick={isSaved ? handleUnsaveClick : handleSaveClick}
//           className={`mr-2 ${isSaved ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded-lg hover:${isSaved ? 'bg-red-600' : 'bg-green-600'}`}
//         >
//           {isSaved ? 'Unsave' : 'Save'}
//         </button>
//       </div>
//       <br/>
//       <APIProvider apiKey={apicode || ''} onLoad={() => console.log('Maps API has loaded.')}>
//         <Map
//           defaultZoom={12}
//           defaultCenter={{ lat: post.latitude, lng: post.longitude }}
//           mapId="your-map-id"
//           style={{ height: '300px', width: '100%' }}
//         >
//           <Marker position={{ lat: post.latitude, lng: post.longitude }} />
//         </Map>
//       </APIProvider>

//       {isLoading && <p>Loading...</p>}
//       {error && <p>Error: {error}</p>}
//     </div>
//   );
// };

return (
  <div className="container mx-auto p-4 relative max-h-screen overflow-y-auto">
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

    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold mb-2">{post.caption}</h1>
      <img src={post.picture} alt={post.caption} className="w-full rounded-lg mb-4" />
      <p className="text-gray-700">{post.description}</p>
      <p className="text-gray-500 text-sm mt-2">Posted by: {post.username}</p>
      <p className="text-gray-500 text-sm mt-2">Group: {post.groupName}</p>
      <p className="text-gray-500 text-sm mt-2">Group description: {post.groupDescription}</p>
      <div className="mt-4">
        
      </div>
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
    <br/>
    <div className="flex justify-center">
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        onClick={() => navigate(`/group/${post.group.id}`, { state: { group: post.group } })}
      >
        View Group
      </button>
    </div>
    <div className="flex justify-center mt-4">
      <button
        className={`font-bold py-2 px-4 rounded ${isSaved ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        onClick={isSaved ? handleUnsaveClick : handleSaveClick}
      >
        {isSaved ? 'Unsave' : 'Save'}
      </button>
    </div>
  </div>
);
};
export default SavedPostDetails;
