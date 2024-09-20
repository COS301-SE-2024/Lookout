import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostsGridSkeleton from './PostsGridSkeleton'; // Import the skeleton

interface User {
  id: number;
  userName: string | null;
  email: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  picture: string;
}

interface Category {
  id: number;
  description: string;
}

interface Post {
  id: number;
  user: User;
  group: Group;
  category: Category;
  picture: string;
  latitude: number;
  longitude: number;
  title: string;
  caption: string;
  createdAt: string;
}

interface SavedPost {
  id: number;
  post: Post | null;
  user: User;
}

interface SavedPostsGridFixProps {
  searchQuery: string;
}

const SavedPostsGridFix: React.FC<SavedPostsGridFixProps> = ({ searchQuery }) => {
  const userId = 1; // This should be dynamically set based on the logged-in user
  const navigate = useNavigate();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await fetch(`/api/savedPosts/user/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Transform the data into the expected structure
        const transformedData = data.map((item: any) => ({
          id: item.savedPostId,
          post: {
            id: item.postId,
            title: item.postTitle,
            caption: item.postCaption,
            latitude: item.postLatitude,
            longitude: item.postLongitude,
            picture: item.postPicture,
            createdAt: item.postCreatedAt,
            category: {
              id: item.postCategoryId,
              description: item.postCategoryDescription,
            },
            group: {
              id: item.groupId,
              name: item.groupName,
              description: item.groupDescription,
              isPrivate: item.groupIsPrivate,
              picture: item.groupPicture,
            },
            user: {
              id: item.userId,
              userName: item.username,
              email: item.userEmail,
            },
          },
          user: {
            id: item.userId,
            userName: item.username,
            email: item.userEmail,
          },
        }));

        // Remove duplicate posts based on post ID
        const uniquePosts = transformedData.reduce((acc: SavedPost[], current: SavedPost) => {
          const x = acc.find(item => item.post?.id === current.post?.id);
          if (!x) {
            acc.push(current);
          }
          return acc;
        }, []);

        setSavedPosts(uniquePosts);
      } catch (error) {
        if (error instanceof Error) {
          setError('Error fetching saved posts: ' + error.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error('Error fetching saved posts:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchSavedPosts();

    // Cleanup function to clear state if component unmounts
    return () => {
      setSavedPosts([]);
    };
  }, [userId]);

  const handlePostClick = (post: Post) => {
    navigate(`/saved_post/${post.id}`, { state: { post } });
  };

  // Filter savedPosts based on searchQuery
  const filteredSavedPosts = savedPosts.filter(savedPost =>
    savedPost.post?.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 scrollbar-hide">
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <PostsGridSkeleton /> // Show skeleton while loading
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSavedPosts.map(savedPost => (
            <div
              key={savedPost.post?.id}
              className="w-full overflow-hidden rounded-md shadow-lg cursor-pointer"
              onClick={() => handlePostClick(savedPost.post!)}
            >
              <Link to={`/saved_post/${savedPost.post?.id}`}>
                <img
                  src={savedPost.post?.picture}
                  alt={`Post ${savedPost.post?.id}`}
                  className="w-full h-40 object-cover"
                />
                {/* Optional: Add caption or other details */}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPostsGridFix;
