import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";

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

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 w-full rounded-md mb-2" />
  </div>
);

const RecommendScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [recommendedGroups, setRecommendedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  const selectedCategory = location.pathname.includes("groups") ? "Groups" : "Posts";

  useEffect(() => {
    if (selectedCategory === "Posts") {
      const fetchRecommendedPosts = async () => {
        try {
          const response = await fetch(
            "/recommend_posts?user_id=1&top_n=10"
          );
          const recommendedData = await response.json();
          const postIds = recommendedData.map((post: { id: number }) => post.id);
          const fullPostDetails: Post[] = [];

          for (const postId of postIds) {
            const postResponse = await fetch(`/api/posts/${postId}`);
            const postDetail = await postResponse.json();
            fullPostDetails.push(postDetail);
          }

          setRecommendedPosts(fullPostDetails);
        } catch (error) {
          console.error("Error fetching recommended posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendedPosts();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "Groups") {
      const fetchRecommendedGroups = async () => {
        try {
          const response = await fetch(
            "/recommend_groups?user_id=1&top_n=10"
          );
          const recommendedData = await response.json();
          const groupIds = recommendedData.map((group: { id: number }) => group.id);
          const fullGroupDetails: Group[] = [];

          for (const groupId of groupIds) {
            const groupResponse = await fetch(`/api/groups/${groupId}`);
            const groupDetail = await groupResponse.json();
            fullGroupDetails.push(groupDetail);
          }

          setRecommendedGroups(fullGroupDetails);
        } catch (error) {
          console.error("Error fetching recommended groups:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecommendedGroups();
    }
  }, [selectedCategory]);


  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);
  };

  const sortedPosts = [...recommendedPosts].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        {/* Back arrow and title */}
        <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/explore')} className="text-navBkg hover:text-icon">
            <MdKeyboardArrowLeft size={42} />
          </button>
          <h1 className="text-2xl font-bold">
            {selectedCategory === "Posts" ? "Posts we think you'll like" : "Groups we think you'll like"}
          </h1>
        </div>

        {selectedCategory === "Posts" && (
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="bg-nav border border-nav rounded-md p-2"
          >
            <option value="newest">
              <FaSortAmountDown className="inline-block mr-2" />
              Newest
            </option>
            <option value="oldest">
              <FaSortAmountUp className="inline-block mr-2" />
              Oldest
            </option>
            <option value="titleAsc">A-Z</option>
            <option value="titleDesc">Z-A</option>
          </select>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {selectedCategory === "Posts" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative cursor-pointer"
                  onClick={() => navigate(`/post/${post.id}`)}
                >
                  <img
                    src={post.picture}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {selectedCategory === "Groups" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
              {recommendedGroups.map((group) => (
                <div
                  key={group.id}
                  className="relative cursor-pointer"
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  <img
                    src={group.picture}
                    alt={group.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1">
                {group.name}
              </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecommendScreen;
