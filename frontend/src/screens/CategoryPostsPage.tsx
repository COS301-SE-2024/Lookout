import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

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
  6: 'Groups', // Add group category
};

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 w-full rounded-md mb-2" />
  </div>
);

const CategoryPostsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortOrder, setSortOrder] = useState(
    localStorage.getItem(`sortOrder_${categoryId}`) || "newest"
  );
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/category/${categoryId}?page=${page}&size=30`);
      const data = await response.json();
      if (page === 0) {
        setPosts(data.content);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data.content]);
      }
      setHasMore(data.content.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const groupResponse = await fetch("/api/groups");
      const userGroupResponse = await fetch(`/api/groups/user/2`);
      
      const groupData = await groupResponse.json();
      const userGroupData = await userGroupResponse.json();
      
      setGroups(groupData.content);
      setUserGroups(userGroupData);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryId === "6") {
      fetchGroups();
    } else {
      fetchPosts(0);
    }
  }, [fetchPosts, fetchGroups, categoryId]);

  useEffect(() => {
    if (categoryId !== "6" && page > 0) {
      fetchPosts(page);
    }
  }, [fetchPosts, page, categoryId]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => {
          if (prevPage === page) return prevPage; // Avoid triggering if the page hasn't changed
          return prevPage + 1;
        });
      }
    }
  }, [hasMore, loading, page]);
  

  useEffect(() => {
    const scrollY = window.scrollY;
    return () => {
      window.scrollTo(0, scrollY); // Preserve scroll position
    };
  }, [loading]);
  

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);
    localStorage.setItem(`sortOrder_${categoryId}`, newSortOrder);
    setPage(0);
  };

  const sortedPosts = [...posts].sort((a, b) => {
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

  const filteredGroups = groups.filter(
    group => !userGroups.some(userGroup => userGroup.id === group.id)
  );

  const categoryName = categoryMap[Number(categoryId)] || "Unknown Category";

  return (
    <div className="p-4 min-h-screen bg-bkg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button onClick={() => navigate('/explore')} className="text-navBkg hover:text-icon">
            <MdKeyboardArrowLeft size={42}  />
          </button>
          <h1 className="text-2xl font-bold ml-2">{categoryName}</h1>
        </div>
        {categoryId !== "6" && (
          <select 
          value={sortOrder} 
          onChange={handleSortChange} 
          className="bg-nav border border-nav rounded-md p-2">
            <option value="newest">
              <FaSortAmountDown className="inline-block mr-2" />
              Newest
            </option>
            <option value="oldest">
              <FaSortAmountUp className="inline-block mr-2" />
              Oldest
            </option>
            <option value="titleAsc">
              A-Z
            </option>
            <option value="titleDesc">
              Z-A
            </option>
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
      {!loading && categoryId === "6" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          {filteredGroups.map((group) => (
            <div 
              key={group.id} 
              className="overflow-hidden relative cursor-pointer"
              onClick={() => handleGroupClick(group)}
            >
              <img 
                src={group.picture} 
                alt={group.name} 
                className="w-full h-48 object-cover" />
              <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1">
                {group.name}
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && categoryId !== "6" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
          {sortedPosts.map((post) => (
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
                {/* {post.title} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPostsPage;
