import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import CategoryPill from "./CategoryPill";
import SkeletonPinDetail from "./PinDetailSkeleton";

interface Post {
  id: number;
  username: string;
  description: string;
  groupName: string;
  groupDescription: string;
  categoryId: any;
  groupId: number;
  title: string;
  user: {
    id: number;
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
  const [userId] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<"post" | "map">("post");
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
        console.log(data);
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
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

    fetchPost();
    checkIfSaved();
  }, [id, userId]);

  const handleSaveClick = async () => {
    try {
      const response = await fetch("/api/savedPosts/SavePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: { id: userId },
          post: { id: post?.id, picture: post?.picture },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      setIsSaved(true);
    } catch (error: any) {
      console.error("Error saving post:", error);
    }
  };

  const handleUnsaveClick = async () => {
    try {
      const response = await fetch(
        `/api/savedPosts/UnsavePost?userId=${userId}&postId=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unsave post");
      }

      setIsSaved(false);
    } catch (error: any) {
      console.error("Error unsaving post:", error);
    }
  };

  if (loading) {
    return <SkeletonPinDetail />;;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  const decodedPictureUrl = hexToString(post.picture);

  return (
    <div className="container mx-auto p-4 relative max-h-screen overflow-y-auto">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-green-700 hover:text-green-500"
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

      <div className="mb-4 ml-16 mt-1">
        <button
          className={`mr-4 ${
            activeTab === "post"
              ? "active border-b-4 border-[#6A994E] font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("post")}
        >
          Post Details
        </button>
        <button
          className={`${
            activeTab === "map"
              ? "active border-b-4 border-[#6A994E] font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("map")}
        >
          Map View
        </button>
      </div>

      {activeTab === "post" && (
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <img
            src={decodedPictureUrl}
            alt={post.caption}
            className="w-full md:w-1/2 lg:w-1/3 mx-auto rounded-lg mb-4"
          />
          <p className="text-gray-700">{post.caption}</p>
          <CategoryPill categoryId={post.categoryId} />
          <p className="text-gray-500 text-sm mt-2">
            Posted by: {post.username}
          </p>
          <p className="text-gray-500 text-sm mt-2">Group: {post.groupName}</p>
          <p className="text-gray-500 text-sm mt-2">
            Group description: {post.groupDescription}
          </p>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
              onClick={() =>
                navigate(`/group/${post.groupId}`, {
                  state: { group: post.groupId },
                })
              }
            >
              View Group
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className={`font-bold py-2 px-4 rounded ${
                isSaved
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={isSaved ? handleUnsaveClick : handleSaveClick}
            >
              {isSaved ? "Unsave" : "Save"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "map" && (
        <div className="mt-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-center">
              {post.title}
            </h2>
            <p className="text-gray-700 mb-4 text-center">{post.description}</p>
            <p className="text-gray-500 text-sm mb-2 text-center">
              Posted by: {post.username}
            </p>
            <p className="text-gray-500 text-sm mb-2 text-center">
              Group: {post.groupName}
            </p>
            <p className="text-gray-500 text-sm mb-2 text-center">
              Group Description: {post.groupDescription}
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <APIProvider
              apiKey={apicode || ""}
              onLoad={() => console.log("Maps API has loaded.")}
            >
              <Map
                defaultZoom={12}
                defaultCenter={{ lat: post.latitude, lng: post.longitude }}
                mapId="your-map-id"
                style={{ height: "400px", width: "100%", maxWidth: "800px" }}
              >
                <Marker
                  position={{ lat: post.latitude, lng: post.longitude }}
                />
              </Map>
            </APIProvider>
          </div>

          
        </div>
      )}
    </div>
  );
};

export default PinDetail;
