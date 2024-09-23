import React, { useRef } from 'react';
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

interface HorizontalCarouselProps {
  children: React.ReactNode;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({ children }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
      >
        <FaChevronLeft className="h-6 w-6 text-gray-700" />
      </button>
      <div ref={carouselRef} className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {children}
      </div>
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
      >
        <FaChevronRight className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
};

export default HorizontalCarousel;