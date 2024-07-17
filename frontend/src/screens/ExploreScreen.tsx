import React, { useEffect, useState } from "react";
import ExploreArticles from "../components/ExploreArticles";
import HorizontalCarousel from "../components/HorizontalCarousel";
import { useNavigate } from "react-router-dom";
import ExploreSkeletonScreen from "../components/ExploreSkeletonScreen";
import ExplorePost from "../components/ExplorePost";
import ExploreGroup from "../components/ExploreGroup";
import { Link } from "react-router-dom";

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
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts/category/3?page=0&size=10");
        const animalResponse = await fetch(
          "/api/posts/category/1?page=0&size=10"
        );
        const campResponse = await fetch(
          "/api/posts/category/2?page=0&size=10"
        );
        const poiResponse = await fetch("/api/posts/category/4?page=0&size=10");
        const securityResponse = await fetch(
          "/api/posts/category/5?page=0&size=10"
        );

        const groupResponse = await fetch("/api/groups");
        const userGroupResponse = await fetch(`/api/groups/user/2`);

        const data = await response.json();
        const animalData = await animalResponse.json();
        const campData = await campResponse.json();
        const poiData = await poiResponse.json();
        const securityData = await securityResponse.json();
        const groupData = await groupResponse.json();
        const userGroupData = await userGroupResponse.json();

        // console.log(animalData);
        console.log("Fetched posts:", groupData);

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

  const filteredPosts = posts.filter((post) => post.userId !== 52);
  const filteredAnimalPosts = animalPosts.filter((post) => post.userId !== 52);
  const filteredCampPosts = campingPosts.filter((post) => post.userId !== 52);
  const filteredPoiPosts = poiPosts.filter((post) => post.userId !== 52);
  const filteredSecurityPosts = securityPosts.filter(
    (post) => post.userId !== 52
  );
  const filteredGroupPosts = groupPosts.filter(
    group => !userGroups.some(userGroup => userGroup.id === group.id)
  );

  return (
    <div className="p-4 scrollbar-hide">
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
        `}
      </style>

      {loading && <ExploreSkeletonScreen />}

      {!loading && (
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
            <Link to="/category/6" className="text-black-500 underline"> {/* to be changed to searchgroups page */}
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
    </div>
  );
};

export default ExploreScreen;
