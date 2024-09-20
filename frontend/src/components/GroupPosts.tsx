import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupPost from "./GroupsPostFix"; // Assuming you have a component to display individual posts

interface User {
  id: number;
  userName: string;
  email: string;
  picture?: string;
  role: string;
  isEnabled: boolean;
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
  user: User;
  picture: string;
  createdAt: string;
}

interface Post {
  id: number;
  user: User;
  group: Group;
  description: string;
  category: { id: number; description: string };
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  createdAt: string;
  categoryId: number;
  userId: number;
  title: string;
}

const GroupPosts: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const fetchGroupPosts = async () => {
      try {
        const groupResponse = await fetch(`/api/groups/${id}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const groupData = await groupResponse.json();
        setGroup(groupData);

        const postsResponse = await fetch(`/api/posts/group/${id}?page=0&size=50`, { // Fetch more posts if needed
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const postsData = await postsResponse.json();
        setPosts(postsData.content);
      } catch (error) {
        console.error("Error fetching group posts:", error);
      }
    };

    fetchGroupPosts();
  }, [id]);

  if (!group) {
    return <p>Loading...</p>; // You can use a skeleton loader or spinner here
  }

  return (
    <div className="container mx-auto p-4 relative ">
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-navBkg hover:text-icon z-50 "
        style={{ zIndex: 50 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div className="text-center mb-8">
        
      </div>

      {posts.length === 0 ? (
        <div className="text-center mt-4">
          <img
            src="https://hub.securevideo.com/Resource/Permanent/Screencap/00/0000/000000/00000001/Screencap-173-020_42DE6C209630EC10647CDDB7D9F693FB77470D486D430F358FF1CB495B65BE55.png"
            alt="No posts"
            className="w-68 h-64 mx-auto mb-4"
          />
          <p className="text-gray-600">There are no posts in this group yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <GroupPost key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupPosts;
