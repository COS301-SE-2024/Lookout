import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryPill from "./CategoryPill";
import SkeletonPinDetail from "./PinDetailSkeleton";
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
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

const hexToString = (hex: string) => {
  const cleanedHex = hex.replace(/\\x/g, "");
  const str = cleanedHex
    .match(/.{1,2}/g)
    ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
    .join("");
  return str || "";
};

const PinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("default");
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saves, setSaves] = useState<number>(0);
  const [userId] = useState<number>(2);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
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
    }

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
        setLoading(false);

        // Fetch related posts once the main post is fetched
        const relatedResponse = await fetch(
          `/api/posts/group/${data.groupId}?page=0&size=10`
        );
        const relatedData = await relatedResponse.json();
        setRelatedPosts(relatedData.content);
      } catch (error) {
        console.error("Error fetching post or related posts:", error);
        setLoading(false);
      }
    };

    const checkIfSaved = async () => {
      try {
        const response = await fetch(
          `/api/savedPosts/isPostSaved?userId=${userId}&postId=${id}`
        );
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
    }

    fetchPost();
    checkIfSaved();
    getCountSaves();
  }, [id, userId]);

  const handleSaveClick = async () => {
    const requestBody = {
      userId,
      postId: post?.id,
    };
  
    console.log("Save request body:", requestBody);
  
    try {
      const response = await fetch("/api/savedPosts/SavePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save post");
      }
  
      setIsSaved(true);
      setSaves((prevSaves) => prevSaves + 1); // Increase saves count
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  
  const handleUnsaveClick = async () => {
    const requestBody = {
      userId,
      postId: post?.id,
    };
  
    console.log("Unsave request body:", requestBody);
  
    try {
      const response = await fetch("/api/savedPosts/UnsavePost", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error("Failed to unsave post");
      }
  
      setIsSaved(false);
      setSaves((prevSaves) => prevSaves - 1); // Decrease saves count
    } catch (error) {
      console.error("Error unsaving post:", error);
    }
  };
  

  const handleSaveIconClick = () => {
    console.log("Save icon clicked");
    if (isSaved) {
      handleUnsaveClick();
    } else {
      handleSaveClick();
    }
  };

  if (loading) {
    return <SkeletonPinDetail />;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  const decodedPictureUrl = hexToString(post.picture);

  return (
    <div className="container mx-auto p-4 relative max-h-screen overflow-y-auto">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .search-results-container {
            display: grid;
            gap: 16px;
            justify-items: start;
          }
          .search-results-container .search-result-card {
            width: 100%;
            margin: 0;
          }
          @media (min-width: 768px) {
            .search-results-container {
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            }
          }
          @media (max-width: 767px) {
            .search-results-container {
              grid-template-columns: 1fr;
            }
            .search-bar {
              width: 100%;
            }
          }
        `}
      </style>

      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-green-700 hover:text-green-500 z-50 mt-2"
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

      <div className="card bg-base-94 shadow-xl rounded-lg">
        <figure className="rounded-t-lg overflow-hidden">
          <img src={decodedPictureUrl} alt={post.title} className="w-full h-full object-cover" />
        </figure>

        <div className="card-body ml-4">
          <div className="flex items-center justify-between mt-2 mb-4">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex items-center mr-4">
              {isSaved ? (
                <FaBookmark className="text-green-800 cursor-pointer" onClick={handleSaveIconClick} />
              ) : (
                <FaRegBookmark className="text-green-800 cursor-pointer" onClick={handleSaveIconClick} />
              )}
              <span className="ml-2">{saves} saves</span>
            </div>
          </div>

          <div className="flex items-center mb-4 justify-between w-full">
            <div className="flex items-center">
              <img
                src='https://i.pinimg.com/originals/b8/5d/8c/b85d8c909a1ada6d7414aa47695d7298.jpg'
                alt={post.username}
                className="w-20 h-20 rounded-full mr-6"
              />
              <div>
                <h2 className="text-lg font-bold">{post.username}</h2>
                <p className="text-gray-600 text-sm">{post.caption}</p>
                <CategoryPill categoryId={post.categoryId} />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4 space-x-2 mt-4">
            <button
              className="px-4 py-1 rounded-full bg-green-800 text-white border-black-2hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => navigate(`/map`, { state: { post, apicode } })}
            >
              View on Map
            </button>
            <button
              className="px-4 py-1 rounded-full bg-green-800 text-white border-black-2hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() =>
                navigate(`/group/${post.groupId}`)
              }
            >
              View Group
            </button>
          </div>

          <div className="mt-4 mb-8">
            <h1 className="text-lm font-semibold">See more posts like this:</h1>

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