import React from 'react';
import { FaPaw, FaExclamationTriangle, FaHiking, FaStar, FaCampground } from 'react-icons/fa'; // Import icons

interface CategoryPillProps {
  category: string;
}

const categoryConfig: { [key: string]: { colorClass: string; icon: React.ReactNode } } = {
  'Animal Sighting': { colorClass: 'bg-green-100 text-green-800', icon: <FaPaw className="mr-1" /> },
  'Security Concern': { colorClass: 'bg-red-100 text-red-800', icon: <FaExclamationTriangle className="mr-1" /> },
  'Hiking Trail': { colorClass: 'bg-yellow-100 text-yellow-800', icon: <FaHiking className="mr-1" /> },
  'Point of Interest': { colorClass: 'bg-blue-100 text-blue-800', icon: <FaStar className="mr-1" /> },
  'Campsite': { colorClass: 'bg-purple-100 text-purple-800', icon: <FaCampground className="mr-1" /> },
  // Add more categories and icons as needed
};

const CategoryPill: React.FC<CategoryPillProps> = ({ category }) => {
  const { colorClass, icon } = categoryConfig[category] || { colorClass: 'bg-gray-100 text-gray-800', icon: null };
  return (
    <span className={`inline-flex items-center ${colorClass} text-xs px-2 py-1 rounded-full mt-2`}>
      {icon}
      {category}
    </span>
  );
};

export default CategoryPill;
