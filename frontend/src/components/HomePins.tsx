
  import React, { useState} from 'react';
  import { 
    Marker,
    InfoWindow
  } from 'react-google-map-wrapper';
  import campIcon from '../assets/icons/camping-zonepin.png';
  import AnimalIcon from '../assets/icons/zoopin.png';
  import HikingIcon from '../assets/icons/mountainpin.png';
  import POIIcon from '../assets/icons/point-of-interestpin.png';
  import SecurityIcon from '../assets/icons/dangerpin.png';
  import { useNavigate } from "react-router-dom";


type myPin = {
  id: string;
  location: google.maps.LatLngLiteral;
  caption: string;
  category: string;
  categoryId: number,
  image: string;
};


const HomePins = (props: { pin: myPin[]}) => {

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
      <div className="font-custom bg-white rounded-lg p-2 max-w-xs">
        <h1 className="text-2xl text-center font-semibold text-black">{category}</h1>
            <img src={image} alt="poi" className="w-full h-32 object-cover mt-2 rounded-md"/>
            <div id='bodyContent'>
            <p className="text-gray-700 text-center mt-2 text-base">{caption}</p>
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


  	const getIconUrl = (category: number) => {
		switch (category) {
			case 2:
				return campIcon;
			case 1:
				return AnimalIcon;
			case 3:
				return HikingIcon;
			case 4:
				return POIIcon;
			case 5:
				return SecurityIcon;
			default:
				return POIIcon; 
		}
	};


  return (
    <>
      {props.pin.map((poi) => (
        <React.Fragment key={poi.id}>
          <Marker
            lat={poi.location.lat}
            lng={poi.location.lng}
            icon={getIconUrl(poi.categoryId)}
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
    </>
  );
};
export default HomePins;

