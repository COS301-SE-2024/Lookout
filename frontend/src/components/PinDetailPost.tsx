import React from "react";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  username: string;
  description: string;
  groupName: string;
  groupDescription: string;
  categoryId: any;
  groupId: number;
  title: string;
  groupPicture: string;
  admin: string;
  userId: number; // Add this line if userId is required
  user: {
    userId: number;
    userName: string;
    email: string;
    passcode: string;
    role: string;
    username: string;
    authorities: { authority: string }[];
    isCredentialsNonExpired: boolean;
    isAccountNonExpired: boolean;
    isAccountNonLocked: boolean;
    password: string;
    isEnabled: boolean;
  };
  group: {
    id: number;
    name: string;
    description: string;
    isPrivate: boolean;
    userId: number;
    username: string;
    user: {
      email: string;
      passcode: string;
      role: string;
      username: string;
      authorities: { authority: string }[];
      isCredentialsNonExpired: boolean;
      isAccountNonExpired: boolean;
      isAccountNonLocked: boolean;
      password: string;
      isEnabled: boolean;
    };
    picture: string;
    createdAt: string;
  };
  category: { id: number; description: string };
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  createdAt: string;
}

const GroupsPost: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  
  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };


  return (
    <div
      className="relative min-w-[200px] ml-4 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer mb-4"
      onClick={() => handlePostClick(post)}
    >
      <img
        src={post.picture}
        alt={post.caption}
        className="min-h-[150px] w-full h-32 object-cover"
      />
    </div>
  );
};

export default GroupsPost;