import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import {useLocation } from 'react-router-dom';
import {
	GoogleMap, 
	GoogleMapApiLoader, 
	MarkerClusterer,
	Marker,
  InfoWindow
} from 'react-google-map-wrapper';

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
  const { group } = location.state as { group: any };


  const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


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
      <GoogleMapApiLoader
        apiKey={apicode || ""}
        suspense
      >
        <div className="map-container">
				<GoogleMap
					className='h-full w-full'
					zoom={5}
					center={{ lat: -33.5111158, lng: 27.098167 }}
 
					mapOptions={{
						disableDefaultUI: true,
						zoomControl: true,
						mapId: 'dde51c47799889c4'
					  }}
				>
          <PoiMarkers pois={pins} />
				</GoogleMap>
			</div>
      </GoogleMapApiLoader>
    </div>
  );
};

const PoiMarkers = (props: { pois: myPin[] }) => {

  const navigate = useNavigate();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handleMarkerClick = (id: string) => {
    setActiveMarker(id);
  };

  const handleCloseClick = () => {
    setActiveMarker(null);
  };

  function Content({ id, category, image, caption }: { id: string; category: string; image: string; caption: string }) {
    return (
      <div id='content'>
      <div className="bg-white rounded-lg shadow-md p-4 max-w-xs">
        <h1 className="text-2xl font-semibold text-black">{category}</h1>
            <img src={image} alt="poi" className="w-full h-32 object-cover mt-2 rounded-md"/>
            <div id='bodyContent'>
            <p className="text-gray-700 mt-2 text-xl">{caption}</p>
            <div className="flex justify-center">
       				<button id="view-details" className="mt-4 bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded"
              onClick={() => navigate(`/post/${id}`)}>
        				View Details
       				</button>
    			</div>
          </div>
      </div>
      </div>
    );
  }

	return (
    <MarkerClusterer>
      {props.pois.map((poi) => (
        <React.Fragment key={poi.id}>
          <Marker
            lat={poi.location.lat}
            lng={poi.location.lng}
            title={poi.caption}
            onClick={() => handleMarkerClick(poi.id)}
          />
          <InfoWindow 
            position={poi.location}
            open={activeMarker === poi.id} 
            ariaLabel={poi.caption}
            content={<Content 
              id={poi.id}
              category={poi.category} 
              image={poi.image} 
              caption={poi.caption} 
            />}
            onCloseClick={handleCloseClick}
          />
        </React.Fragment>
      ))}
    </MarkerClusterer>
  );
};

export default GroupsMap;
