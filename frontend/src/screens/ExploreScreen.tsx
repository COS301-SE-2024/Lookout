import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ExplorePost from "../components/ExplorePost";
import ExploreGroup from "../components/ExploreGroup";
import ExploreSkeletonScreen from "../components/ExploreSkeletonScreen";
import HorizontalCarousel from "../components/HorizontalCarousel";
import ExploreArticles from "../components/ExploreArticles";

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
  groupId: number;
  user: User;
  group: Group;
  description: String;
  title: string;
  category: { id: number; description: string };
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  createdAt: string;
  categoryId: any;
}

const ExploreScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [animalPosts, setAnimalPosts] = useState<Post[]>([]);
  const [campingPosts, setCampingPosts] = useState<Post[]>([]);
  const [poiPosts, setPoiPosts] = useState<Post[]>([]);
  const [securityPosts, setSecurityPosts] = useState<Post[]>([]);
  const [groupPosts, setGroupPosts] = useState<Group[]>([]);
  const [, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {

        const response = await fetch('/api/image/category/3?page=0&size=10');
        const animalResponse =  await fetch('/api/image/category/1?page=0&size=10')
        const campResponse =  await fetch('/api/image/category/2?page=0&size=10')
        const poiResponse = await fetch('/api/image/category/4?page=0&size=10')
        const securityResponse = await fetch('/api/image/category/5?page=0&size=10')

        const groupResponse = await fetch("/api/groups");
        const userGroupResponse = await fetch(`/api/groups/user/2`);


        const data = await response.json();
        const animalData = await animalResponse.json();
        const campData = await campResponse.json();
        const poiData = await poiResponse.json();
        const securityData = await securityResponse.json();

        const groupData = await groupResponse.json();
        const userGroupData = await userGroupResponse.json();


        setPosts(data.content);
        setAnimalPosts(animalData.content);
        setCampingPosts(campData.content);
        setPoiPosts(poiData.content);
        setSecurityPosts(securityData.content);
        setGroupPosts(groupData.content);
        setUserGroups(userGroupData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredAnimalPosts = animalPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredCampPosts = campingPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPoiPosts = poiPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredSecurityPosts = securityPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredGroupPosts = groupPosts.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <h1 className="text-2xl font-bold mb-4">Animal Sighting</h1>
      <HorizontalCarousel>
        {filteredAnimalPosts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={`data:image/png;base64,${post.picture}`}
              alt={post.caption}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.caption}</p>
              <p className="text-gray-500 text-sm flex items-center">
                <IoLocationOutline className="h-4 w-4 mr-1" />
                {/* {post.location} */}
              </p>
              <CategoryPill category={"Animal Sighting"} />
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      <h1 className="text-2xl font-bold mb-4">Campsite</h1>
      <HorizontalCarousel>
        {filteredCampPosts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={`data:image/png;base64,${post.picture}`}
              alt={post.caption}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.caption}</p>
              <p className="text-gray-500 text-sm flex items-center">
                <IoLocationOutline className="h-4 w-4 mr-1" />
                {/* {post.location} */}
              </p>
              <CategoryPill category={"Campsite"} />
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      <h1 className="text-2xl font-bold mb-4">Hiking Trails</h1>
      <HorizontalCarousel>
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={`data:image/png;base64,${post.picture}`}
              alt={post.caption}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.caption}</p>
              <p className="text-gray-500 text-sm flex items-center">
                <IoLocationOutline className="h-4 w-4 mr-1" />
                {/* {post.location} */}
              </p>
              <CategoryPill category={"Hiking Trail"} />
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      <h1 className="text-2xl font-bold mb-4">Explore Points of Interest</h1>
      <HorizontalCarousel>
        {filteredPoiPosts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={`data:image/png;base64,${post.picture}`}
              alt={post.caption}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.caption}</p>
              <p className="text-gray-500 text-sm flex items-center">
                <IoLocationOutline className="h-4 w-4 mr-1" />
                {/* {post.location} */}
              </p>
              <CategoryPill category={"Point of Interest"} />
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      <h1 className="text-2xl font-bold mb-4">Security Concerns</h1>
      <HorizontalCarousel>
        {filteredSecurityPosts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={`data:image/png;base64,${post.picture}`}
              alt={post.caption}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700">{post.caption}</p>
              <p className="text-gray-500 text-sm flex items-center">
                <IoLocationOutline className="h-4 w-4 mr-1" />
                {/* {post.location} */}
              </p>
              <CategoryPill category={"Security Concern"} />
            </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for Posts or Groups"
          className="border p-2 rounded w-full search-bar"
        />
      </div>

      {loading && <ExploreSkeletonScreen />}

      {!loading && searchQuery === "" && (
        <>
          <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
            <span>Animal Sightings</span>
            <Link to="/category/1" className="text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredAnimalPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-2xl font-bold mb-4 flex justify-between items-center mt-8">
            <span>Campsites</span>
            <Link to="/category/2" className="text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredCampPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-2xl font-bold mb-4 flex justify-between items-center mt-8">
            <span>Hiking Trails</span>
            <Link to="/category/3" className="text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-2xl font-bold mb-4 flex justify-between items-center mt-8">
            <span>Points of Interest</span>
            <Link to="/category/4" className="text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredPoiPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-2xl font-bold mb-4 flex justify-between items-center mt-8">
            <span>Security Concerns</span>
            <Link to="/category/5" className="text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredSecurityPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-2xl font-bold mb-4 flex justify-between items-center mt-8">
            <span>Groups</span>
            <Link to="/category/6" className="text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredGroupPosts.map((group) => (
              <ExploreGroup key={group.id} group={group} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-2xl font-bold mb-4 mt-8">Articles</h1>
          <div className="">
            <ExploreArticles />

          </div>
        </>
      )}

      {!loading && searchQuery !== "" && (
        <div className="search-results-container">
          {filteredPosts.map((post) => (
            <div className="search-result-card">
              <ExplorePost key={post.id} post={post} />
            </div>
          ))}
          {filteredAnimalPosts.map((post) => (
            <div className="search-result-card">
              <ExplorePost key={post.id} post={post} />
            </div>
          ))}
          {filteredCampPosts.map((post) => (
            <div className="search-result-card">
              <ExplorePost key={post.id} post={post} />
            </div>
          ))}
          {filteredPoiPosts.map((post) => (
            <div className="search-result-card">
              <ExplorePost key={post.id} post={post} />
            </div>
          ))}
          {filteredSecurityPosts.map((post) => (
            <div className="search-result-card">
              <ExplorePost key={post.id} post={post} />
            </div>
          ))}
          {filteredGroupPosts.map((group) => (
            <div className="search-result-card">
              <ExploreGroup key={group.id} group={group} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreScreen;
