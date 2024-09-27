import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLocationOutline } from 'react-icons/io5'; // Import the location icon
import CategoryPill from './CategoryPill'; // Import your CategoryPill component

interface Post {
  id: number;
  userid: number;
  groupid: number;
  categoryid: number;
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  title: string; // Added title to the Post interface
}

interface SavedPost {
  id: number;
  post: Post;
}

const SavedPostsGrid: React.FC = () => {
  const navigate = useNavigate();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);

  useEffect(() => {
    fetch('/api/savedPosts/user/2', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      setSavedPosts(data);
    })
    .catch((error) => console.error('Error fetching saved posts:', error));
  }, []);

  const handlePostClick = (post: Post) => {
    navigate(`/saved_post/${post.id}`, { state: { post } });
  };

  return (
    <div className="container mx-auto p-4">
      {savedPosts.length === 0 ? (
        <div className="text-center text-gray-500">
          You have not saved any posts yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPosts.map(savedPost => (
            <div
              key={savedPost.post.id}
              className="relative min-w-[300px] h-96 ml-8 bg-nav rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => handlePostClick(savedPost.post)}
            >
              <Link to={`/saved_post/${savedPost.post.id}`}>
                <img
                  src={`data:image/png;base64,${savedPost.post.picture}`}
                  alt={`Post ${savedPost.post.id}`}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{savedPost.post.title}</h2> {/* Assuming title exists */}
                <p className="text-content2">{savedPost.post.caption}</p>
                <p className="text-content2 text-sm flex items-center">
                  <IoLocationOutline className="h-4 w-4 mr-1" />
                  <p className="text-content2">{savedPost.post.latitude}, {savedPost.post.longitude}</p>
                </p>
                <CategoryPill categoryId={savedPost.post.categoryid} /> {/* Use categoryid from post */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPostsGrid;
