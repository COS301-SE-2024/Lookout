import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExploreGroup from './ExploreGroup'; 

interface Group {
    id: number;
    name: string;
    description: string;
    isPrivate: boolean;
    userId: number; // Adjusted to match the JSON structure
    user: User | null;
    picture: string;
    createdAt: string;
}

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

const CreatedGroupsList: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('/api/groups', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }) 
      .then((response) => response.json())
      .then((data) => {
        // Filter groups to only include those with a userId of 2
        const filteredGroups = data.content.filter((group: Group) => group.userId === 2);
        setGroups(filteredGroups);
      })
      .catch((error) => console.error('Error fetching created groups:', error));
  }, []);

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groups.map((group) => (
          <ExploreGroup key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default CreatedGroupsList;