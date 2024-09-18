import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostsGridSkeleton from './PostsGridSkeleton'; // Import the skeleton

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

interface PostsGridFixProps {
  searchQuery: string;
}

const PostsGridFix: React.FC<PostsGridFixProps> = ({ searchQuery }) => {
  // ADD IN FROM LOGIN LATER
  const userId = 1;
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/user/${userId}`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const postsData = data.content.map((item: any) => ({
          id: item.id,
          userid: item.userId,
          groupid: item.groupId,
          categoryid: item.categoryId,
          picture: item.picture,
          latitude: item.latitude,
          longitude: item.longitude,
          caption: item.caption,
          title: item.title,
        }));
        setPosts(postsData);
      } catch (error) {
        setError('Error fetching posts: ' + error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchPosts();
  }, [userId]);

  const handlePostsClick = (post: Post) => {
    navigate(`/user_post/${post.id}`, { state: { post } });
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 scrollbar-hide">
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <PostsGridSkeleton /> // Show skeleton while loading
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="overflow-hidden rounded-md shadow-lg cursor-pointer"
              onClick={() => handlePostsClick(post)}
            >
              <Link to={`/saved_post/${post.id}`}>
                <img
                  src={post.picture}
                  alt={`Post ${post.id}`}
                  className="w-full h-40 object-cover"
                />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsGridFix;
