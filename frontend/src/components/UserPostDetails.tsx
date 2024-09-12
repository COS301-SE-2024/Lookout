import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryPill from "./CategoryPill";
import SkeletonPinDetail from "./PinDetailSkeleton";
import { FaBookmark, FaRegBookmark, FaEdit } from 'react-icons/fa';
import HorizontalCarousel from "../components/HorizontalCarousel";
import PinDetailPost from "./PinDetailPost";

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
  userId: number;
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


interface User {
  userName: string;
  email: string;
  passcode: string;
  role: string;
  isEnabled: boolean;
  password: string;
  username: string;
  profilePic: string;
  authorities: { authority: string }[];
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isAccountNonExpired: boolean;
}

const PinDetail: React.FC = () => {
  const userId = 1;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("default");
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saves, setSaves] = useState<number>(0);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableCaption, setEditableCaption] = useState("");
  const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const localStoreTheme = localStorage.getItem("data-theme") || "default";
    setTheme(localStoreTheme);
  }, []);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "data-theme") {
        const newTheme = localStorage.getItem("data-theme") || "default";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
        setEditableTitle(data.title);
        setEditableCaption(data.caption);

        const relatedResponse = await fetch(`/api/posts/group/${data.groupId}?page=0&size=10`);
        const relatedData = await relatedResponse.json();
        setRelatedPosts(relatedData.content);

        // Fetch user details using post.userId
        const userResponse = await fetch(`/api/users/${data.userId}`);
        const userData = await userResponse.json();
        setUser(userData);  // Store user data including profile picture

  
      } catch (error) {
        console.error("Error fetching post or related posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkIfSaved = async () => {
      try {
        const response = await fetch(`/api/savedPosts/isPostSaved?userId=${userId}&postId=${id}`);
        const data = await response.json();
        setIsSaved(data);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    const getCountSaves = async () => {
      try {
        const response = await fetch(`/api/savedPosts/countSaves?postId=${id}`);
        const data = await response.json();
        setSaves(data);
      } catch (error) {
        console.error("Error fetching saves count:", error);
      }
    };

    fetchPost();
    checkIfSaved();
    getCountSaves();
  }, [id, userId]);

  const handleSaveClick = async () => {
    const requestBody = { userId, postId: post?.id };

    try {
      const response = await fetch("/api/savedPosts/SavePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      setIsSaved(true);
      setSaves(prevSaves => prevSaves + 1);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleUnsaveClick = async () => {
    const requestBody = { userId, postId: post?.id };

    try {
      const response = await fetch("/api/savedPosts/UnsavePost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to unsave post");
      }

      setIsSaved(false);
      setSaves(prevSaves => prevSaves - 1);
    } catch (error) {
      console.error("Error unsaving post:", error);
    }
  };

  const handleSaveIconClick = () => {
    if (isSaved) {
      handleUnsaveClick();
    } else {
      handleSaveClick();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDoneClick = async () => {
    if (post) {
      const updatedPost: Post = {
        ...post,
        title: editableTitle,
        caption: editableCaption,
      };

      try {
        const response = await fetch("/api/posts/UpdatePost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPost),
        });

        if (!response.ok) {
          throw new Error("Failed to update post");
        }

        setPost(updatedPost);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  const handleCancelClick = () => {
    setEditableTitle(post?.title || "");
    setEditableCaption(post?.caption || "");
    setIsEditing(false);
  };

  if (loading) {
    return <SkeletonPinDetail />;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="container  mx-auto p-4 relative max-h-screen overflow-y-auto">
      <div className="flex items-center z-50 ">
        <button
          onClick={() => navigate('/profile')}
          className="absolute top-4 left-4 text-content hover:text-white"
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
        {isEditing ? (
          <>
            <button
              className="absolute top-4 right-6 text-white bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-full px-4 py-2 cursor-pointer"
              onClick={handleDoneClick}
            >
              Done
            </button>
            <button
              className="absolute top-4 left-12  text-white bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg rounded-full px-4 py-2 cursor-pointer"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </>
        ) : (
          <FaEdit
            className="absolute top-4 right-4 text-xl text-content cursor-pointer"
            onClick={handleEditClick}
            size={30}
          />
        )}
      </div>
  
      <div className="bg-bkg shadow-xl rounded-lg overflow-hidden mt-12">
        <figure className="w-full h-60 md:h-96 overflow-hidden">
          <img
            src={post.picture}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </figure>
  
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            {isEditing ? (
              <input
                type="text"
                className="md:text-3xl text-content border-navBkg bg-navBkg font-bold border border-navBkg rounded-full text-center w-full md:w-auto"
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
            )}
            <div className="flex items-center">
              {isSaved ? (
                <FaBookmark
                  className="text-navBkg cursor-pointer"
                  onClick={handleSaveIconClick}
                  size={24}
                />
              ) : (
                <FaRegBookmark
                  className="text-navBkg cursor-pointer"
                  onClick={handleSaveIconClick}
                  size={24}
                />
              )}
              <span className="ml-2">{saves} saves</span>
            </div>
          </div>
  
          <div className="flex items-center mb-4">
            <img
              src={user?.profilePic}
              alt={post.username}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full mr-4"
            />
            <div>
              <h2 className="text-lg font-bold">{post.username}</h2>
              {isEditing ? (
                <textarea
                  className="text-content text-sm w-full border border-navBkg bg-navBkg rounded-lg mt-2 p-2"
                  value={editableCaption}
                  onChange={(e) => setEditableCaption(e.target.value)}
                />
              ) : (
                <p className="text-content text-sm">{post.caption}</p>
              )}
              <div className="mt-2">
                <CategoryPill categoryId={post.categoryId} />
              </div>
            </div>
          </div>
  
          <div className="flex justify-center mt-4 space-x-2">
            <button
              className="px-4 py-1 rounded-full bg-navBkg text-white hover:bg-white hover:text-navBkg focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => navigate(`/map`, { state: { post, apicode } })}
            >
              View on Map
            </button>
            <button
              className="px-4 py-1 rounded-full bg-navBkg text-white hover:bg-white hover:text-navBkg focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() =>
                navigate(`/group/${post.groupId}`, {
                  state: { group: post.group },
                })
              }
            >
              View Group
            </button>
          </div>
  
          <div className="mt-8">
            <h1 className="text-lg font-semibold">See more posts like this:</h1>
  
            <HorizontalCarousel>
              {relatedPosts.map((relatedPost) => (
                <PinDetailPost key={relatedPost.id} post={relatedPost} />
              ))}
            </HorizontalCarousel>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PinDetail;
