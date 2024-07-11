import React, { useEffect, useState } from "react";
import ExploreArticles from "../components/ExploreArticles";
import HorizontalCarousel from "../components/HorizontalCarousel";
import { IoLocationOutline } from "react-icons/io5";
import CategoryPill from "../components/CategoryPill";
import { useNavigate } from "react-router-dom";

interface PointOfInterest {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  category: string;
}

// const pointsOfInterest: PointOfInterest[] = [
//   {
//     id: 1,
//     title: "Lion Sighting",
//     description: "Saw a lion near the waterhole.",
//     imageUrl:
//       "https://www.krugerpark.co.za/images/black-maned-lion-shem-compion-786x500.jpg",
//     location: "Serengeti, Tanzania",
//     category: "Animal Sighting",
//   },
//   {
//     id: 2,
//     title: "Broken Fence",
//     description: "Noticed a broken fence on the hiking trail.",
//     imageUrl:
//       "https://media.istockphoto.com/id/1427130990/photo/old-broken-withered-wooden-fence-around-private-property.jpg?s=612x612&w=0&k=20&c=QXSbJUcfW16oajIGvPNeTchIUfThhpUUdEMZ_kZRPqk=",
//     location: "Yellowstone National Park, USA",
//     category: "Security Concern",
//   },
//   {
//     id: 3,
//     title: "Lion Sighting",
//     description: "Saw a lion near the waterhole.",
//     imageUrl:
//       "https://www.krugerpark.co.za/images/black-maned-lion-shem-compion-786x500.jpg",
//     location: "Serengeti, Tanzania",
//     category: "Animal Sighting",
//   },
//   {
//     id: 4,
//     title: "Broken Fence",
//     description: "Noticed a broken fence on the hiking trail.",
//     imageUrl:
//       "https://media.istockphoto.com/id/1427130990/photo/old-broken-withered-wooden-fence-around-private-property.jpg?s=612x612&w=0&k=20&c=QXSbJUcfW16oajIGvPNeTchIUfThhpUUdEMZ_kZRPqk=",
//     location: "Yellowstone National Park, USA",
//     category: "Hiking Trail",
//   },
//   {
//     id: 5,
//     title: "Lion Sighting",
//     description: "Saw a lion near the waterhole.",
//     imageUrl:
//       "https://www.krugerpark.co.za/images/black-maned-lion-shem-compion-786x500.jpg",
//     location: "Serengeti, Tanzania",
//     category: "POI",
//   },
//   // Add more points of interest here
// ];

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
}

const ExploreScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [animalposts, setanimalPosts] = useState<Post[]>([]);
  const [campingposts, setcampingPosts] = useState<Post[]>([]);
  const [poiposts, setpoiPosts] = useState<Post[]>([]);
  const [securityposts, setsecurityPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/category/3?page=0&size=10');
        const animalResponse =  await fetch('/api/posts/category/1?page=0&size=10')
        const campResponse =  await fetch('/api/posts/category/2?page=0&size=10')
        const poiResponse = await fetch('/api/posts/category/4?page=0&size=10')
        const securityResponse = await fetch('/api/posts/category/5?page=0&size=10')

        const data = await response.json();
        const animalData= await animalResponse.json();
        const campData = await campResponse.json();
        const poiData = await poiResponse.json();
        const securityData = await securityResponse.json();
        
        // console.log(data)
        // console.log(animalData)
        // console.log(campData)
        // console.log(poiData)

        setPosts(data.content); 
        setanimalPosts(animalData.content);
        setcampingPosts(campData.content);
        setpoiPosts(poiData.content);
        setsecurityPosts(securityData.content);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  }

  if (posts.length === 0 || animalposts.length === 0) {
    return (
      <div className="text-center">
        <img
          src="https://hub.securevideo.com/Resource/Permanent/Screencap/00/0000/000000/00000001/Screencap-173-020_42DE6C209630EC10647CDDB7D9F693FB77470D486D430F358FF1CB495B65BE55.png"
          alt="No posts"
          className="w-68 h-64 mx-auto mb-4"
        />
        <p className="text-gray-600">There are no posts yet. Be the first to post!</p>
      </div>
    );
  }
  const filteredPosts = posts.filter(post => post.userId !== 52);
  const filteredAnimalPosts = animalposts.filter(post => post.userId ! = 52)
  const filteredCampPosts = campingposts.filter(post => post.userId ! = 52)
  const filteredPoiPosts = poiposts.filter(post => post.userId ! = 52)
  const filteredSecurityPosts = securityposts.filter(post => post.userId ! = 52)

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

      <h1 className="text-2xl font-bold mb-4">Animal Sighting</h1>
      <HorizontalCarousel>
        {filteredAnimalPosts.map((post) => (
          <div
            key={post.id}
            className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden"
            onClick={() => handlePostClick(post)}
          >
            <img
              src={post.picture}
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
              src={post.picture}
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
              src={post.picture}
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
              src={post.picture}
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
              src={post.picture}
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
          </div>
        ))}
      </HorizontalCarousel>

      <h1 className="text-2xl font-bold mb-4 mt-8">Articles</h1>
      <HorizontalCarousel>
        <ExploreArticles />
      </HorizontalCarousel>
    </div>
  );
};

export default ExploreScreen;
