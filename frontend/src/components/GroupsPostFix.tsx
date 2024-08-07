import React, { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import CategoryPill from "./CategoryPill";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  userName: string;
  email: string;
  picture ?: string;
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
  user: User; // Adjusted to match the API response
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

const GroupsPost: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  
  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <div
      className="min-w-[200px] ml-4 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => handlePostClick(post)}
    >
      <img
        src={post.picture}
        alt={post.caption}
        className="w-full h-32 object-cover"
      />
    </div>
  );
};

export default GroupsPost;