import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; //useParams, 

const PinDetail = () => {
  //const { id } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    const localStoreTheme = localStorage.getItem("data-theme") || "default";
    setTheme(localStoreTheme);
  }, []);
  

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "data-theme") {
        const newTheme =
          localStorage.getItem("data-theme") || "default";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const pin = {
    id: 1,
    title: 'The Setting Sun ',
    owner: 'Owner',
    description: 'An elephant mother and her cub share a tender moment under the setting sun, a heartwarming scene of maternal love and protection on the African plains.',
    imageUrl: 'https://i.pinimg.com/originals/2e/c0/77/2ec0773a1fcd847a5bd258ea4bba668e.jpg',
  };

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
    
      <div className="flex justify-center items-center">
        <p className="text-2xl font-bold mb-2">{pin.title}</p>
        {/* <p className="text-gray-600">{pin.owner}</p> */}
      </div>

        <div className="flex justify-center items-center  ">
          <img src={pin.imageUrl} alt={`${pin.title} logo`} className="w-full rounded-lg mb-4" />
        </div>

      <div className="flex justify-center items-center text-center">
      {pin.description}
      </div>
      <div className="flex justify-center items-center mt-4">
        View it on the map below
    </div>
      <div className="h-20 bg-green-900"></div>
      <div className="flex justify-center items-center">
      <button className={`border border-${theme} text-${theme} hover:bg-${theme} hover:text-green font-bold py-2 px-4 rounded mt-4 transition-colors duration-50`} style={{ borderWidth: "4px" }}>
        Join this group
      </button>
      </div>
    </div>
  );
};

export default PinDetail;
