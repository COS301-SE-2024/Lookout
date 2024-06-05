import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

const GroupsList = ({
  groups
}: {
  groups: { id: number; name: string; owner: string; picture: string; description: string }[];
}) => {
  const navigate = useNavigate();

  const handleGroupClick = (group: { id: number; name: string; owner: string; picture: string; description: string }) => {
    navigate(`/group/${group.id}`, { state: { group } });
  };

  return (
    <div className="container mx-auto p-4">
      {/* <h2 className="text-xl font-bold mb-4">Your Groups</h2> */}
      <div className="space-y-4">
        {groups.map(group => (
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
