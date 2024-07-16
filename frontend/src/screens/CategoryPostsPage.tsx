import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  description: string;
  title: string;
  category: { id: number; description: string };
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  createdAt: string;
  categoryId: any;
}

const categoryMap: { [key: number]: string } = {
  1: 'Animal Sightings',
  2: 'Campsites',
  3: 'Hiking Trails',
  4: 'Points of Interest',
  5: 'Security Concerns',
};

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 w-full rounded-md mb-2" />
  </div>
);

const CategoryPostsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts/category/${categoryId}?page=0&size=50`);
        const data = await response.json();
        setPosts(data.content);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryId]);

  const categoryName = categoryMap[Number(categoryId)] || "Unknown Category";

  return (
    <div className="p-4">
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      )}
      {!loading && (
        <>
          <h1 className="text-2xl font-bold mb-4">{categoryName}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="overflow-hidden relative cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <img 
                  src={post.picture} 
                  alt={post.title} 
                  className="w-full h-48 object-cover" />
                <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {post.title}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPostsPage;