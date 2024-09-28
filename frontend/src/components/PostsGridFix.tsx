import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import PostsGridSkeleton from './PostsGridSkeleton'; // Import the skeleton
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
  title: string;
  createdAt: string;
}

interface PostsGridFixProps {
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

const PostsGridFix: React.FC<PostsGridFixProps> = ({ searchQuery }) => {
  const userId = 1; // Example userId, update this later
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/user`, {
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
          createdAt: item.createdAt,
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

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.caption.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="scrollbar-hide">
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <PostsGridSkeleton /> // Show skeleton while loading
      ) : (
        <div>
          {filteredPosts.length === 0 ? (
            <div className="text-center text-gray-500">
              You have not created any posts yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="w-full overflow-hidden rounded-md shadow-lg cursor-pointer bg-nav"
                >
                  <Link to={`/user_post/${post.id}`}>
                    <img
                      src={post.picture}
                      alt={post.caption}
                      className="w-full h-40 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <h2 className="text-lg font-bold">{post.title}</h2>
                    <p className="text-content2">{post.caption}</p>
                    <span className="text-content2 md:text-base text-sm">
                    {post.createdAt
                      ? `${getDayWithSuffix(
                          new Date(post.createdAt)
                        )} ${new Date(
                          post.createdAt
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

export default PostsGridFix;
