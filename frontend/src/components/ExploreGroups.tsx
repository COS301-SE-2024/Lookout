import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
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

const ExploreGroups: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/groups')
      .then(response => response.json())
      .then(data => setGroups(data))
      .catch(error => console.error('Error fetching groups:', error));
  }, []);

  const handleArrowClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Your Groups</h2>
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="flex items-center p-4 border rounded-lg shadow-sm">
            <img src={group.picture} alt={`${group.name} logo`} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
              <div className="text-lg font-semibold">{group.name}</div>
              <div className="text-gray-500">{group.user ? group.user.userName : 'No owner'}</div>
            </div>
            <button onClick={() => handleArrowClick(group)}>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreGroups;
