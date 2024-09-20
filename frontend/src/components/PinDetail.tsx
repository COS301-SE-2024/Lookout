import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryPill from "./CategoryPill";
import SkeletonPinDetail from "./PinDetailSkeleton";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
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
    profilepic: string;
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("default");
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
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
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data);
        setLoading(false);

        const relatedResponse = await fetch(`/api/posts/group/${data.groupId}?page=0&size=10`);
        const relatedData = await relatedResponse.json();
        setRelatedPosts(relatedData.content);

        const userResponse = await fetch(`/api/users/${data.userId}`);
        const userData = await userResponse.json();
        setUser(userData);

        const savedResponse = await fetch(`/api/savedPosts/isPostSaved?userId=${userId}&postId=${id}`);
        const isPostSaved = await savedResponse.json();
        setIsSaved(isPostSaved);

        const savesResponse = await fetch(`/api/savedPosts/countSaves?postId=${id}`);
        const savesCount = await savesResponse.json();
        setSaves(savesCount);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
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

  
  if (!post || !user) {
    return <SkeletonPinDetail />;
  }
 
  

  return (
    <div className="p-4 scrollbar-hide">
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
        className="absolute top-8 left-4 md:top-20 md:left-8 text-navBkg hover:text-icon z-50 mt-2 rounded-full p-2 "
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

      <div className="container mx-auto p-4 mt-16">
        <div className="card bg-base-100 shadow-xl rounded-lg flex flex-col md:flex-row">
          <figure className="rounded-t-lg overflow-hidden md:w-1/2">
            <img
              src={post.picture}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </figure>

          <div className="card-body p-4 md:w-1/2">
            <div className="flex items-center justify-between mt-2 mb-4">
              <h1 className="text-2xl font-bold">{post.title}</h1>
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
                src={user.profilePic}
                alt={post.username}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-bold">{post.username}</h2>
                <p className="text-content2 text-sm">{post.caption}</p>
                <CategoryPill categoryId={post.categoryId} />
              </div>
            </div>

            <div className="flex justify-start mt-4 space-x-4">
              <button
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white rounded-lg px-4 py-2 text-sm"
                onClick={() => navigate(`/map`, { state: { post, apicode } })}
              >
                View on Map
              </button>
              <button
								className="bg-navBkg hover:bg-white hover:text-navBkg border border-navBkg text-white rounded-lg px-4 py-2 text-sm"
                onClick={() => {
                  if (window.location.pathname !== `/group/${post.groupId}`) {
                    navigate(`/group/${post.groupId}`, {
                      state: { group: post.group },
                      replace: true,
                    });
                  }
                }}                               
              >
                View Group
              </button>
            </div>

            <div className="mt-8">
              <h1 className="text-lg font-semibold">
                See more posts like this:
              </h1>

              <HorizontalCarousel>
                {relatedPosts.map((relatedPost) => (
                  <PinDetailPost key={relatedPost.id} post={relatedPost} />
                ))}
              </HorizontalCarousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;
