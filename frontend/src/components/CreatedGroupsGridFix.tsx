import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import GroupsGridSkeleton from './GroupsGridSkeleton'; // Import the skeleton loader

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

interface CreatedGroupsGridFixProps {
  searchQuery: string;
}

const CreatedGroupsGridFix: React.FC<CreatedGroupsGridFixProps> = ({ searchQuery }) => {
  const userId = 1;
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch('/api/groups', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();

        const filteredGroups = data.content.filter((group: Group) => group.userId === userId);
        const uniqueGroups = filteredGroups.reduce((acc: Group[], current: Group) => {
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
    navigate(`/createdGroup/${group.id}`, { state: { group } });
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <GroupsGridSkeleton />
      ) : (
        <div className="space-y-3">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="flex items-center p-2 border rounded-lg shadow-sm group-item cursor-pointer hover:bg-gray-100 h-36"
              onClick={() => handleGroupClick(group)}
            >
              <div className="flex-shrink-0">
                <img
                  src={group.picture}
                  alt={`${group.name} logo`}
                  className="w-28 h-32 object-cover rounded-md"
                />
              </div>
              <div className="flex-1 ml-2 flex flex-col justify-between">
                <div>
                  <div className="text-lg font-semibold">{group.name}</div>
                  <p className="text-gray-600 text-xs mt-1 truncate">{group.description}</p>
                </div>
              </div>
              {/* Arrow is now outside of the flex container holding image and text */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 ml-4">
                <FaChevronRight className="text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatedGroupsGridFix;
