import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryPill from "../components/CategoryPill";

interface Group {
  id: number;
  name: string;
  owner: string;
  picture: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
}

const GroupCard: React.FC<{ group: Group }> = ({ group }) => {
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleGroupClick = (group: Group) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  const handleJoinClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const url = joinedGroups.includes(id) ? '/api/groups/RemoveMemberFromGroup' : '/api/groups/AddMemberToGroup';
    const body = JSON.stringify({ groupId: id, userId: 2 }); // Assuming userId is 2 for this example

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    }).then(response => {
      if (response.status === 204) {
        if (joinedGroups.includes(id)) {
          setJoinedGroups(joinedGroups.filter(groupId => groupId !== id));
        } else {
          setJoinedGroups([...joinedGroups, id]);
        }
      } else if (response.status === 400) {
        response.text().then(errorMessage => {
          console.error(errorMessage);
          // alert(errorMessage);
        });
      } else {
        throw new Error('Unexpected response status');
      }
    }).catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetch('/api/groups/user/2') // Assuming userId is 2 for this example
      .then(response => response.json())
      .then((data: Group[]) => {
        const joinedGroupIds = data.map(group => group.id);
        setJoinedGroups(joinedGroupIds);
      })
      .catch(error => console.error('Error fetching joined groups:', error));
  }, []);

  return (
    <div
      className="min-w-[300px] h-96 ml-8 bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between cursor-pointer"
      onClick={() => handleGroupClick(group)}
    >
      <img
        src={group.picture}
        alt={group.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h2 className="text-xl font-semibold">{group.name}</h2>
          <p className="text-gray-700">{group.description}</p>
          <CategoryPill categoryId={6} />
        </div>
        {/* <div className="mt-4 flex justify-end">
          <button
            className={`px-4 py-2 rounded-full ${
              joinedGroups.includes(group.id) ? 'bg-green-200 text-black border border-red-2' : 'bg-blue-500 text-white hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-gray-400`}
            onClick={(e) => handleJoinClick(e, group.id)}
          >
            {joinedGroups.includes(group.id) ? 'Joined' : 'Join'}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default GroupCard;
