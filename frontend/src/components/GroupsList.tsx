import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

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
    fetch('/api/groups/user/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    }) 
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the data to check the response format
        setGroups(data);
      })
      .catch((error) => console.error('Error fetching groups:', error));
  }, []);

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex items-center p-4 border rounded-lg shadow-sm group-item cursor-pointer hover:bg-gray-100"
            onClick={() => handleGroupClick(group)}
          >
            <img
              src={group.picture}
              alt={`${group.name} logo`}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="text-lg font-semibold">{group.name}</div>
              <div className="text-gray-500">{group.owner}</div>
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
              <FaChevronRight className="text-gray-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupsList;
