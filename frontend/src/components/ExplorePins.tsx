import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
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
  userId: number;
  user: User;
  group: Group;
  description: String;
  category: { id: number; description: string };
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  createdAt: string;
}

const ExplorePins: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const givenUserId = 52;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?page=0&size=10');
        const data = await response.json();
        console.log(data)
        setPosts(data.content); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  }

  if (posts.length === 0) {
    return (
      <div className="text-center">
        <img
          src="https://hub.securevideo.com/Resource/Permanent/Screencap/00/0000/000000/00000001/Screencap-173-020_42DE6C209630EC10647CDDB7D9F693FB77470D486D430F358FF1CB495B65BE55.png"
          alt="No posts"
          className="w-68 h-64 mx-auto mb-4"
        />
        <p className="text-gray-600">There are no posts yet. Be the first to post!</p>
      </div>
    );
  }

  // Filter posts based on the condition (user.id !== givenUserId)
  const filteredPosts = posts.filter(post => post.userId !== givenUserId);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="p-4 border rounded-lg shadow-sm cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            {post.picture && (
              <img
                src={post.picture}
                alt={post.caption}
                className="w-full h-auto mb-2 rounded"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
            )}
            <h3 className="text-lg font-semibold mb-2">{post.caption}</h3>
            <p className="text-gray-700">{post.description}</p>
            <p className="text-gray-500 text-sm mt-2">Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
  
export default ExplorePins;
