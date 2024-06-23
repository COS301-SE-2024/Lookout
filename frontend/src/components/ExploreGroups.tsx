import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';

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
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  // const [page, setPage] = useState(0);
  // const [hasMore, setHasMore] = useState(true);
  // const pageSize = 10; // Number of groups per page

  const fetchGroups = useCallback(() => {
    fetch(`/api/groups`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched groups:', data.content);
        setGroups(data.content); // Set all groups retrieved from the server
        // setHasMore(false); // No more data to fetch, since we're fetching all at once
      })
      .catch(error => console.error('Error fetching groups:', error));
  }, []);
  
  

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]); 

  const fetchJoinedGroups = useCallback(() => {
    fetch('/api/groups/user/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        const joinedGroupIds = data.map((group: Group) => group.id);
        console.log('Fetched user\'s groups:', data);
        setJoinedGroups(joinedGroupIds);
      })
      .catch(error => console.error('Error fetching user\'s groups:', error));
  }, []);

  useEffect(() => {
    fetchJoinedGroups();
  }, [fetchJoinedGroups]);

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  const handleJoinClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (joinedGroups.includes(id)) {
      setJoinedGroups(joinedGroups.filter(groupId => groupId !== id));
    } else {
      setJoinedGroups([...joinedGroups, id]);
    }
  };

  // const fetchMoreData = () => {
  //   setPage(prevPage => prevPage + 1);
  // };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-4">
        {groups.map(group => (
          <div
            key={group.id} // Ensure key is unique
            className="flex items-center p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
            onClick={() => handleGroupClick(group)}
          >
            <img src={group.picture} alt={`${group.name} logo`} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
              <div className="text-lg font-semibold">{group.name}</div>
              <div className="text-gray-500">{group.user ? group.user.userName : 'No owner'}</div>
              <p className="text-sm text-gray-600 mt-1">{group.description}</p>
            </div>
            <button
              className={`flex items-center justify-center w-20 h-10 rounded-full ${
                joinedGroups.includes(group.id) ? 'bg-green-200 text-black border border-red-2' : 'bg-blue-500 text-white hover:bg-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-gray-400`}
              onClick={(e) => handleJoinClick(e, group.id)}
            >
              {joinedGroups.includes(group.id) ? 'Joined' : 'Join'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default ExploreGroups;
