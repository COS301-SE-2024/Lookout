import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryPill from "./CategoryPill"; 

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

const RecommendGroup: React.FC<{ group: Group; rank?: number }> = ({ group, rank }) => {
  const navigate = useNavigate();

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  return (
    <div
      className="relative min-w-[300px] h-96 ml-8 bg-nav rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => handleGroupClick(group)}
    >
      <img
        src={group.picture}
        alt={group.name}
        className="w-full h-48 object-cover"
      />
      {rank !== undefined && (
        <div className="absolute top-2 left-2 bg-navBkg text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
          {rank}
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold ">{group.name}</h2>
        <p className="line-clamp-3 text-content2">{group.description}</p>
        <CategoryPill categoryId={6} />
      </div>
    </div>
  );
};

export default RecommendGroup;
