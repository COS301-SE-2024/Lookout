import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExploreGroups = () => {
  const navigate = useNavigate();
  
  const groups = [
    { id: 1, name: 'Hidden Gems', owner: 'Evelyn Smith', imageUrl: 'https://i.pinimg.com/originals/80/4c/82/804c82e561475688f6c115e3df2d8288.jpg' },
    { id: 2, name: 'For the Love of Trees', owner: 'Alex Anderson', imageUrl: 'https://i.pinimg.com/originals/4d/d7/c0/4dd7c0f68fd9d0d51f13cba3a8f24163.jpg' },
    { id: 3, name: 'Sunset Moments', owner: 'Harper Garcia', imageUrl: 'https://i.pinimg.com/originals/51/c2/d2/51c2d29f95977f38e9be0d20a599d42c.jpg' },
    { id: 4, name: 'Elephant Fanatics', owner: 'Ava Jackson', imageUrl: 'https://i.pinimg.com/originals/62/5b/0e/625b0e73e60198e123ba03a6ae1bc574.jpg' },
    { id: 5, name: 'Stripe Savvy Syndicate ', owner: 'Anthony Harris', imageUrl: 'https://i.pinimg.com/originals/cb/e7/d3/cbe7d319fa566e5d19d25921d2ec7ca5.jpg' },
  ];

  const handleArrowClick = (id: number) => {
    navigate(`/group/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Your Groups</h2>
      <div className="space-y-4">
        {groups.map(group => (
          <div key={group.id} className="flex items-center p-4 border rounded-lg shadow-sm">
            <img src={group.imageUrl} alt={`${group.name} logo`} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
              <div className="text-lg font-semibold">{group.name}</div>
              <div className="text-gray-500">{group.owner}</div>
            </div>
            <button onClick={() => handleArrowClick(group.id)}>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreGroups;
