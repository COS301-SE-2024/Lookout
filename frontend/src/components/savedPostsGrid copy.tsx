import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  userid: number;
  groupid: number;
  categoryid: number;
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {savedPosts.map(savedPost => (
          <div key={savedPost.post.id} className="w-full overflow-hidden rounded-md" onClick={() => handlePostClick(savedPost.post)}>
            <Link to={`/saved_post/${savedPost.post.id}`}>
              <img
                src={savedPost.post.picture}
                alt={`Post ${savedPost.post.id}`}
                className="w-full h-full object-cover"
                style={{ height: '150px' }}
              />
              <div className="mt-2 text-center">{savedPost.post.caption}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPostsGrid;
