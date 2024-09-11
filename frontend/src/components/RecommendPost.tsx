import { IoLocationOutline } from "react-icons/io5";
import CategoryPill from "../components/CategoryPill";
import { useNavigate } from "react-router-dom";

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
  categoryId: any;
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
  rank?: number; // Optional rank property
}

const RecommendPost: React.FC<{ post: Post; rank?: number }> = ({ post, rank }) => {
  const navigate = useNavigate();

  const handlePostClick = (post: Post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <div
      className="relative min-w-[300px] h-96 ml-8 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => handlePostClick(post)}
    >
      <img
        src={`${post.picture}`}
        alt={post.caption}
        className="w-full h-48 object-cover"
      />
      {rank !== undefined && (
        <div className="absolute top-2 left-2 bg-green-800 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
          {rank}
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="text-gray-700">{post.caption}</p>
        <p className="text-gray-500 text-sm flex items-center">
          <IoLocationOutline className="h-4 w-4 mr-1" />
          <p className="text-gray-700">{post.latitude}, {post.longitude}</p>
        </p>
        <CategoryPill categoryId={post.categoryId} />
      </div>
    </div>
  );
};

export default RecommendPost;
