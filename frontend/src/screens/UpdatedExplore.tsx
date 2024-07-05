// src/components/UpdatedExplore.tsx
import React from 'react';
import ExploreArticles from '../components/ExploreArticles';
import HorizontalCarousel from '../components/HorizontalCarousel';
import { IoLocationOutline } from "react-icons/io5";
import CategoryPill from '../components/CategoryPill';

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
    category: 'Hiking Trail',
  },
  {
    id: 5,
    title: 'Lion Sighting',
    description: 'Saw a lion near the waterhole.',
    imageUrl: 'https://www.krugerpark.co.za/images/black-maned-lion-shem-compion-786x500.jpg',
    location: 'Serengeti, Tanzania',
    category: 'POI',
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
              <p className="text-gray-500 text-sm flex items-center">
                <IoLocationOutline className="h-4 w-4 mr-1" />
                {poi.location}
              </p>
              <CategoryPill category={poi.category} />
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      <h1 className="text-2xl font-bold mb-4 mt-8">Articles</h1>
      <HorizontalCarousel>
        <ExploreArticles />
      </HorizontalCarousel>
    </div>
  );
};

export default UpdatedExplore;
