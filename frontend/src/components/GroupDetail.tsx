import React from 'react';
import { useNavigate } from 'react-router-dom'; //useParams,

const GroupDetail = () => {
  //const { id } = useParams();
  const navigate = useNavigate();

  // Replace this with a real data fetching logic
  const group = {
    id: 1,
    name: 'Hidden Gems',
    owner: 'Evelyn Smith',
    description: 'Join us to hunt natures hidden gems! Our expert guides specialize in tracking elusive creatures like the leopard. Explore diverse landscapes, uncovering the wilds secrets with us.',
    imageUrl: 'https://i.pinimg.com/originals/80/4c/82/804c82e561475688f6c115e3df2d8288.jpg',
  };

  const images = [
    'https://i.pinimg.com/originals/e7/87/20/e78720fc202723aee3a01954cd20b6c7.jpg',
    'https://i.pinimg.com/originals/12/9d/5f/129d5f467b48f214224e155d4fa153b8.jpg',
    'https://i.pinimg.com/originals/af/b6/9b/afb69b39eccdf0900aea9827c4d72e97.jpg',
    'https://i.pinimg.com/originals/d7/45/a0/d745a0938efa00a33aef6f73135fe3ee.jpg',
    'https://i.pinimg.com/originals/37/b4/63/37b463a42a437b19e5b8a7117fca473c.jpg',
    'https://i.pinimg.com/originals/45/8d/a8/458da8fe602fe96f5c2fc0904e5bf3ce.jpg',
  ];

  return (
    <div className="container mx-auto p-4 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-blue-500 hover:text-blue-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{group.name}</h1>
        <img src={group.imageUrl} alt={`${group.name} logo`} className="w-32 h-32 rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Created by: {group.owner}</h2>
        <p className="text-gray-600 mt-4">{group.description}</p>
      </div>
      <br />
      <h2 className="text-xl font-bold mb-4">Pins in this group</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="w-full overflow-hidden rounded-md">
            <img src={image} alt={`Pin ${index + 1}`} className="w-full h-full object-cover" style={{height: '150px'}} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupDetail;
