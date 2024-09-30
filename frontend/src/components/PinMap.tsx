import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

const PinMap: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { post, apicode } = location.state as { post: any, apicode: string };

  // console.log("Google Maps API Key:", apicode); // Log API key
  return (
    <div className="h-screen w-screen relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-20 left-4 text-navBkg hover:text-icon font-bold z-50 mt-2"
        style={{ zIndex: 50 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <APIProvider apiKey={apicode || ""}>
        <Map
          defaultZoom={12}
          defaultCenter={{ lat: post.latitude, lng: post.longitude }}
          mapId="your-map-id"
          style={{ height: "100%", width: "100%" }}
        >
          <Marker position={{ lat: post.latitude, lng: post.longitude }} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default PinMap;