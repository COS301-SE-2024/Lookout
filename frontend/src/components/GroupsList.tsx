import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupCard from './GroupCard';

interface Group {
  id: number;
  name: string;
  owner: string;
  picture: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch('/api/groups/user/2', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }) 
      .then((response) => response.json())
      .then((data) => {
        setGroups(data);
      })
      .catch((error) => console.error('Error fetching groups:', error));
  }, []);

  return (
    <div className="container mx-auto px-2 py-4"> {/* Adjusted padding here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
};

export default GroupsList;