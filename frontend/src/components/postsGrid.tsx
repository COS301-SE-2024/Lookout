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

const PostsGrid: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts/user/52', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.content); // Log the data to check the response format
      setPosts(data.content);
    })
    .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handlePostsClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map(post => (
          <div key={post.id} className="w-full overflow-hidden rounded-md" onClick={() => handlePostsClick(post)}>
            <Link to={`/post/${post.id}`}>
              <img
                src={post.picture}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover"
                style={{ height: '150px' }}
              />
              <div className="mt-2 text-center">{post.caption}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsGrid;
