import React, { useEffect, useState, startTransition } from "react";
import { Link } from "react-router-dom";
import ExplorePost from "../components/ExplorePost";
import RecommendPost from "../components/RecommendPost";
import ExploreGroup from "../components/ExploreGroup";
import RecommendGroup from "../components/RecommendGroup";
import ExploreSkeletonScreen from "../components/ExploreSkeletonScreen";
import HorizontalCarousel from "../components/HorizontalCarousel";
//import ExploreArticles from "../components/ExploreArticles";
import DOMPurify from 'dompurify';

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
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [recommendedGroups, setRecommendedGroups] = useState<Group[]>([]);

  
  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        // Fetch from cache
        const fetchFromCache = () => {
          const cachedPosts = localStorage.getItem("posts");
          const cachedAnimalPosts = localStorage.getItem("animalPosts");
          const cachedCampingPosts = localStorage.getItem("campingPosts");
          const cachedPoiPosts = localStorage.getItem("poiPosts");
          const cachedSecurityPosts = localStorage.getItem("securityPosts");
          const cachedGroupPosts = localStorage.getItem("groupPosts");
          const cachedRecommendedPosts = localStorage.getItem("recommendedPosts");
          const cachedRecommendedGroups = localStorage.getItem("recommendedGroups");
          const cachedTimestamp = localStorage.getItem("postsTimestamp");

          return {
            posts: cachedPosts ? JSON.parse(cachedPosts) : null,
            animalPosts: cachedAnimalPosts ? JSON.parse(cachedAnimalPosts) : null,
            campingPosts: cachedCampingPosts ? JSON.parse(cachedCampingPosts) : null,
            poiPosts: cachedPoiPosts ? JSON.parse(cachedPoiPosts) : null,
            securityPosts: cachedSecurityPosts ? JSON.parse(cachedSecurityPosts) : null,
            groupPosts: cachedGroupPosts ? JSON.parse(cachedGroupPosts) : null,
            recommendedPosts: cachedRecommendedPosts ? JSON.parse(cachedRecommendedPosts) : null,
            recommendedGroups: cachedRecommendedGroups ? JSON.parse(cachedRecommendedGroups) : null,
            cachedTimestamp: cachedTimestamp ? parseInt(cachedTimestamp) : null,
          };
        };

        const cacheData = fetchFromCache();
        const now = Date.now();
        const expirationTime = 60 * 1000; // 1 minute cache expiration

        // Check if cached data is valid and recent
        if (
          cacheData.posts &&
          cacheData.animalPosts &&
          cacheData.campingPosts &&
          cacheData.poiPosts &&
          cacheData.securityPosts &&
          cacheData.groupPosts &&
          cacheData.recommendedPosts &&
          cacheData.recommendedGroups &&
          cacheData.cachedTimestamp &&
          now - cacheData.cachedTimestamp < expirationTime
        ) {
          // Use cached data
          setPosts(cacheData.posts);
          setAnimalPosts(cacheData.animalPosts);
          setCampingPosts(cacheData.campingPosts);
          setPoiPosts(cacheData.poiPosts);
          setSecurityPosts(cacheData.securityPosts);
          setGroupPosts(cacheData.groupPosts);
          setRecommendedPosts(cacheData.recommendedPosts);
          setRecommendedGroups(cacheData.recommendedGroups);
          setLoading(false);
        } else {
          // Fetch data if cache is expired or empty
          const [
            postResponse,
            animalResponse,
            campResponse,
            poiResponse,
            securityResponse,
            groupResponse,
            userGroupResponse,
            recommendedPostResponse,
            recommendedGroupResponse,
          ] = await Promise.all([
            fetch("/api/posts/category/3?page=0&size=12"),
            fetch("/api/posts/category/1?page=0&size=10"),
            fetch("/api/posts/category/2?page=0&size=10"),
            fetch("/api/posts/category/4?page=0&size=10"),
            fetch("/api/posts/category/5?page=0&size=10"),
            fetch("/api/groups"),
            fetch(`/api/groups/user`),
            fetch("/recommend_posts?user_id=1&top_n=10"),
            fetch("/recommend_groups?user_id=1&top_n=10"),
          ]);

          const [
            postData,
            animalData,
            campData,
            poiData,
            securityData,
            groupData,
            userGroupData,
            recommendedPostData,
            recommendedGroupData,
          ] = await Promise.all([
            postResponse.json(),
            animalResponse.json(),
            campResponse.json(),
            poiResponse.json(),
            securityResponse.json(),
            groupResponse.json(),
            userGroupResponse.json(),
            recommendedPostResponse.json(),
            recommendedGroupResponse.json(),
          ]);

          // Process recommended posts and groups
          const postIds = recommendedPostData.map((post: { id: number }) => post.id);
          const fullPostDetails: Post[] = [];
          for (const postId of postIds) {
            const postDetailResponse = await fetch(`/api/posts/${postId}`);
            const postDetail = await postDetailResponse.json();
            fullPostDetails.push(postDetail);
          }

          const groupIds = recommendedGroupData.map((group: { id: number }) => group.id);
          const fullGroupDetails: Group[] = [];
          for (const groupId of groupIds) {
            const groupDetailResponse = await fetch(`/api/groups/${groupId}`);
            const groupDetail = await groupDetailResponse.json();
            fullGroupDetails.push(groupDetail);
          }

          // Update state with new data
          setPosts(postData.content);
          setAnimalPosts(animalData.content);
          setCampingPosts(campData.content);
          setPoiPosts(poiData.content);
          setSecurityPosts(securityData.content);
          setGroupPosts(groupData.content);
          setUserGroups(userGroupData);
          setRecommendedPosts(fullPostDetails);
          setRecommendedGroups(fullGroupDetails);

          // Cache new data
          localStorage.setItem("posts", JSON.stringify(postData.content));
          localStorage.setItem("animalPosts", JSON.stringify(animalData.content));
          localStorage.setItem("campingPosts", JSON.stringify(campData.content));
          localStorage.setItem("poiPosts", JSON.stringify(poiData.content));
          localStorage.setItem("securityPosts", JSON.stringify(securityData.content));
          localStorage.setItem("groupPosts", JSON.stringify(groupData.content));
          localStorage.setItem("recommendedPosts", JSON.stringify(fullPostDetails));
          localStorage.setItem("recommendedGroups", JSON.stringify(fullGroupDetails));
          localStorage.setItem("postsTimestamp", now.toString());

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchExploreData();
  }, []);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = DOMPurify.sanitize(event.target.value);
    startTransition(() => {
      setSearchQuery(query);
    });
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

      <div className="mb-4 w-full">
  <input
    type="text"
    value={searchQuery}
    onChange={handleSearchChange}
    placeholder="Search for Posts or Groups"
    className="border p-2 rounded w-full max-w-[75vw] md:max-w-full search-bar bg-gray-200"
  />
</div>

      {loading && <ExploreSkeletonScreen />}

      {!loading && searchQuery === "" && (
        <>

        <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">
          <span>Posts we think you'll like</span>
          <Link to="/recommend/posts" className="text-sm md:text-base text-black-500 underline">
            View All
          </Link>
        </h1>


          <HorizontalCarousel>
            {recommendedPosts.map((post, index) => (
              <RecommendPost key={post.id} post={post} rank={index + 1} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">            
            <span>Groups we think you'll like</span>
            <Link to="/recommend/groups"className="text-sm md:text-base text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {recommendedGroups.map((group, index) => (
              <RecommendGroup key={group.id} group={group} rank={index + 1} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">
                        <span>Animal Sightings</span>
            <Link to="/category/1" className="text-sm md:text-base text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredAnimalPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">
                        <span>Campsites</span>
            <Link to="/category/2" className="text-sm md:text-base text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredCampPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">
                        <span>Hiking Trails</span>
            <Link to="/category/3" className="text-sm md:text-base text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">
                        <span>Points of Interest</span>
            <Link to="/category/4" className="text-sm md:text-base text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredPoiPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">
                        <span>Security Concerns</span>
            <Link to="/category/5" className="text-sm md:text-base text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredSecurityPosts.map((post) => (
              <ExplorePost key={post.id} post={post} />
            ))}
          </HorizontalCarousel>

          <h1 className="text-lg md:text-2xl font-bold mb-4 flex justify-between items-center">
                        <span>Groups</span>
            <Link to="/category/6" className="text-sm md:text-base text-black-500 underline">
              View All
            </Link>
          </h1>
          <HorizontalCarousel>
            {filteredGroupPosts.map((group) => (
              <ExploreGroup key={group.id} group={group} />
            ))}
          </HorizontalCarousel>

          {/* <h1 className="text-2xl font-bold mb-4 mt-8">Articles</h1>
          <div className="">
            <ExploreArticles />
          </div> */}
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
