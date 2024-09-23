import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

interface Group {
  userId: number;
  id: number;
  name: string;
  owner: string;
  picture: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

interface GroupsGridFixProps {
  searchQuery: string;
}

const GroupsGridFix: React.FC<GroupsGridFixProps> = ({ searchQuery }) => {
  // ADD IN FROM LOGIN LATER
	const userId = 1;
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const joinedGroupsResponse = await fetch(`/api/groups/user/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const joinedGroups = await joinedGroupsResponse.json();

        const createdGroupsResponse = await fetch('/api/groups', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const allGroups = await createdGroupsResponse.json();
        const createdGroups = allGroups.content.filter((group: Group) => group.userId === userId);

        setGroups([...joinedGroups, ...createdGroups]);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  // Filter groups based on searchQuery
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-3">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="flex items-center p-2 border rounded-lg shadow-sm group-item cursor-pointer hover:bg-gray-100"
            onClick={() => handleGroupClick(group)}
          >
            <div className="flex-shrink-0 w-24 h-full">
              <img
                src={group.picture}
                alt={`${group.name} logo`}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex-1 ml-4">
              <div className="text-lg font-semibold">{group.name}</div>
              <p className="text-gray-600 text-xs mt-1">{group.description}</p>
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

export default GroupsGridFix;
