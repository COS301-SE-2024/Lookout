import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostsGridSkeleton from './PostsGridSkeleton'; // Import the skeleton
import { IoLocationOutline } from 'react-icons/io5'; // Import the location icon
import CategoryPill from './CategoryPill'; // Import your CategoryPill component

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
  userid: number;
  groupid: number;
  categoryId: any;
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  title: string; 
  createdAt: string;
}

interface SavedPost {
  id: number;
  post: Post;
}


interface SavedPostsGridFixProps {
  searchQuery: string;
}

const getDayWithSuffix = (date: Date) => {
	const day = date.getDate();
	const suffix =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
			? "nd"
			: day % 10 === 3 && day !== 13
			? "rd"
			: "th";
	return `${day}${suffix}`;
};


const SavedPostsGridFix: React.FC<SavedPostsGridFixProps> = ({ searchQuery }) => {
  
  const navigate = useNavigate();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const response = await fetch(`/api/savedPosts/user`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        if (response.status === 403) {
					// Handle 403 Forbidden error
					console.error("Access denied: You do not have permission to access this resource.");
					// Redirect to login or show a specific message
					window.location.href = "/login?cleardata=true";
				  }
        const data = await response.json();

        // Transform the data into the expected structure
        const transformedData = data.map((item: any) => ({
          id: item.savedPostId,
          post: {
            id: item.postId,
            title: item.postTitle,
            caption: item.postCaption,
            categoryId: item.categoryId,
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

        setSavedPosts(transformedData);
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
  }, []);

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
        <div>
          {filteredSavedPosts.length === 0 ? (
            <div className="text-center text-gray-500">
              You have not saved any posts yet.
            </div>
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
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{savedPost.post?.title}</h2>
                    <p className="text-content2">{savedPost.post?.caption}</p>
                    <span className="text-content2 md:text-base text-sm">
                      
                    {savedPost.post.createdAt
                      ? `${getDayWithSuffix(
                          new Date(savedPost.post.createdAt)
                        )} ${new Date(
                          savedPost.post.createdAt
                        ).toLocaleDateString("en-GB", {
                          month: "long",
                          year: "numeric"
                        })}`
                      : "Unknown"}
                  </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedPostsGridFix;
