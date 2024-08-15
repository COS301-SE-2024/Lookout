import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import {useLocation } from 'react-router-dom';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

type myPin = {
  longitude: number;
  latitude: number;
  id: string;
  location: google.maps.LatLngLiteral;
  caption: string;
  category: string;
  image: string;
  categoryId: number;
};

const GroupsMap: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //const { id } = useParams<{ id: string }>();
  const [pins, setPins] = useState<myPin[]>([]);
  const { group, apicode } = location.state as { group: any, apicode: string };


  // const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch(`/api/posts/group/${group.id}?page=0&size=10`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch pins");
        }

        const pinsData = await response.json();
        const formattedPins = pinsData.content.map((pin: any) => ({
          id: pin.id,
          location: { lat: pin.latitude, lng: pin.longitude },
          caption: pin.caption,
          category: pin.caption,
          categoryId: pin.categoryId,
          latitude: pin.latitude,
          longitude: pin.longitude,
          image: pin.picture
        }));
        setPins(formattedPins);
      
        console.log("Fetched Pins:", formattedPins); // Log fetched pins data
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };

    fetchPins();
  }, [group.id]);

  // console.log("Pins State:", pins); // Log pins state

  return (
    <div className="h-screen w-screen relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-green-700 hover:text-green-500 z-50 mt-2"
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
          defaultCenter={{ lat: pins[0]?.location?.lat || 0, lng: pins[0]?.location?.lng || 0 }}
          style={{ height: "100%", width: "100%" }}
        >
          {pins.map((pin) => (
          <Marker position={{ lat: pin.latitude, lng: pin.longitude }} />
        ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default GroupsMap;
