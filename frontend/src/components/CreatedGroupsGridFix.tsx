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
  // ADD IN FROM LOGIN LATER
  //const userId = 2;
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true); 
      try {
        const response = await fetch('/api/groups/user/createdBy', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.status === 403) {
          // Handle 403 Forbidden error
          console.error("Access denied: You do not have permission to access this resource.");
          // Redirect to login or show a specific message
          window.location.href = "/login?cleardata=true";
        }
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();

       

        // const filteredGroups = data.content.filter((group: Group) => group.userId === userId);
        // const uniqueGroups = filteredGroups.reduce((acc: Group[], current: Group) => {
        //   const x = acc.find(group => group.id === current.id);
        //   if (!x) {
        //     acc.push(current);
        //   }
        //   return acc;
        // }, []);

        setGroups(data);
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
  }, []);

  const handleGroupClick = (group: Group) => {
    navigate(`/createdGroup/${group.id}`, { state: { group } });
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto">
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <GroupsGridSkeleton />
      ) : (
        <div className="space-y-3">
          {filteredGroups.length === 0 ? (
            <div className="text-center text-content">
              You have not created any groups yet.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center p-4 bg-hver border border-hver rounded-lg shadow-sm group-item cursor-pointer hover:bg-bkg"
                onClick={() => handleGroupClick(group)}
              >
                <div className="flex-shrink-0">
                  <img
                    src={group.picture}
                    alt={`${group.name} logo`}
                    className="w-28 h-32 object-cover rounded-md"
                  />
                </div>
  
                {/* Text section */}
                <div className="flex-1 ml-4 flex flex-col">
                  <div className="text-base font-semibold break-words">{group.name}</div>
                  {/* Wrapping description */}
                  <p className="text-content2 text-sm mt-1 break-words whitespace-normal line-clamp-2">
                    {group.description}
                  </p>
                </div>
                
                {/* Arrow is now outside of the flex container holding image and text */}
                <div className="flex items-center justify-center w-10 h-10 ml-4">
                  <FaChevronRight className="text-content" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
  
};
export default CreatedGroupsGridFix;


