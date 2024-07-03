// src/components/UpdatedExplore.tsx
import React from 'react';
import ExploreArticles from '../components/ExploreArticles';
import HorizontalCarousel from '../components/HorizontalCarousel';

interface PointOfInterest {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  category: string;
}

const pointsOfInterest: PointOfInterest[] = [
  {
    id: 1,
    title: 'Lion Sighting',
    description: 'Saw a lion near the waterhole.',
    imageUrl: 'https://www.krugerpark.co.za/images/black-maned-lion-shem-compion-786x500.jpg',
    location: 'Serengeti, Tanzania',
    category: 'Animal Sighting',
  },
  {
    id: 2,
    title: 'Broken Fence',
    description: 'Noticed a broken fence on the hiking trail.',
    imageUrl: 'https://media.istockphoto.com/id/1427130990/photo/old-broken-withered-wooden-fence-around-private-property.jpg?s=612x612&w=0&k=20&c=QXSbJUcfW16oajIGvPNeTchIUfThhpUUdEMZ_kZRPqk=',
    location: 'Yellowstone National Park, USA',
    category: 'Security Concern',
  },
  {
    id: 3,
    title: 'Lion Sighting',
    description: 'Saw a lion near the waterhole.',
    imageUrl: 'https://www.krugerpark.co.za/images/black-maned-lion-shem-compion-786x500.jpg',
    location: 'Serengeti, Tanzania',
    category: 'Animal Sighting',
  },
  {
    id: 4,
    title: 'Broken Fence',
    description: 'Noticed a broken fence on the hiking trail.',
    imageUrl: 'https://media.istockphoto.com/id/1427130990/photo/old-broken-withered-wooden-fence-around-private-property.jpg?s=612x612&w=0&k=20&c=QXSbJUcfW16oajIGvPNeTchIUfThhpUUdEMZ_kZRPqk=',
    location: 'Yellowstone National Park, USA',
    category: 'Security Concern',
  },
  {
    id: 5,
    title: 'Lion Sighting',
    description: 'Saw a lion near the waterhole.',
    imageUrl: 'https://www.krugerpark.co.za/images/black-maned-lion-shem-compion-786x500.jpg',
    location: 'Serengeti, Tanzania',
    category: 'Animal Sighting',
  },
  // Add more points of interest here
];

const UpdatedExplore: React.FC = () => {
    return (
      <div className="p-4 scrollbar-hide">
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
  
            .scrollbar-hide {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
          `}
        </style>
  
        <h1 className="text-2xl font-bold mb-4">Explore Points of Interest</h1>
        <HorizontalCarousel>
          {pointsOfInterest.map((poi) => (
            <div key={poi.id} className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden">
              <img src={poi.imageUrl} alt={poi.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{poi.title}</h2>
                <p className="text-gray-700">{poi.description}</p>
                <p className="text-gray-500 text-sm">{poi.location}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">{poi.category}</span>
              </div>
            </div>
          ))}
        </HorizontalCarousel>

        <h1 className="text-2xl font-bold mb-4">Animal Sightings</h1>
        <HorizontalCarousel>
          {pointsOfInterest.map((poi) => (
            <div key={poi.id} className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden">
              <img src={poi.imageUrl} alt={poi.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{poi.title}</h2>
                <p className="text-gray-700">{poi.description}</p>
                <p className="text-gray-500 text-sm">{poi.location}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">{poi.category}</span>
              </div>
            </div>
          ))}
        </HorizontalCarousel>

        <h1 className="text-2xl font-bold mb-4">Hiking Trails</h1>
        <HorizontalCarousel>
          {pointsOfInterest.map((poi) => (
            <div key={poi.id} className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden">
              <img src={poi.imageUrl} alt={poi.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{poi.title}</h2>
                <p className="text-gray-700">{poi.description}</p>
                <p className="text-gray-500 text-sm">{poi.location}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">{poi.category}</span>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
  
        <h1 className="text-2xl font-bold mb-4">Security Concerns</h1>
        <HorizontalCarousel>
          {pointsOfInterest.map((poi) => (
            <div key={poi.id} className="min-w-[300px] h-96 bg-white rounded-lg shadow-md overflow-hidden">
              <img src={poi.imageUrl} alt={poi.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{poi.title}</h2>
                <p className="text-gray-700">{poi.description}</p>
                <p className="text-gray-500 text-sm">{poi.location}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">{poi.category}</span>
              </div>
            </div>
          ))}
        </HorizontalCarousel>

        <h1 className="text-2xl font-bold mb-4 mt-8">Articles</h1>
          <ExploreArticles />
      </div>
    );
  };

export default UpdatedExplore;
