import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import GroupsGridSkeleton from './GroupsGridSkeleton'; // Import the skeleton

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
  const userId = 1;
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true); // Start loading
      try {
        const joinedGroupsResponse = await fetch(`/api/groups/user/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!joinedGroupsResponse.ok) {
          throw new Error('Failed to fetch joined groups');
        }
        const joinedGroups = await joinedGroupsResponse.json();

        const createdGroupsResponse = await fetch('/api/groups', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!createdGroupsResponse.ok) {
          throw new Error('Failed to fetch all groups');
        }
        const allGroups = await createdGroupsResponse.json();
        const createdGroups = allGroups.content.filter((group: Group) => group.userId === userId);

        const combinedGroups = [...joinedGroups, ...createdGroups];
        const uniqueGroups = combinedGroups.reduce((acc: Group[], current: Group) => {
          const x = acc.find(group => group.id === current.id);
          if (!x) {
            acc.push(current);
          }
          return acc;
        }, []);

        setGroups(uniqueGroups);
      } catch (error) {
        if (error instanceof Error) {
          setError('Error fetching groups: ' + error.message);
        } else {
          setError('An unknown error occurred');
        }
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchGroups();

    return () => {
      setGroups([]);
    };
  }, [userId]);

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <GroupsGridSkeleton />
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-start p-4 border rounded-lg shadow-sm group-item cursor-pointer hover:bg-gray-100"
              onClick={() => handleGroupClick(group)}
            >
              {/* Group image */}
              <div className="flex-shrink-0">
                <img
                  src={group.picture}
                  alt={`${group.name} logo`}
                  className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover rounded-md"
                />
              </div>

              {/* Text section */}
              <div className="flex-1 ml-4 flex flex-col">
                <div className="text-base font-semibold break-words">{group.name}</div>
                {/* Wrapping description */}
                <p className="text-gray-600 text-sm mt-1 break-words whitespace-normal">
                  {group.description}
                </p>
              </div>

              {/* Chevron button fixed to the right */}
              <div className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">
                <FaChevronRight className="text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsGridFix;
