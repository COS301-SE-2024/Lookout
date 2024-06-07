import React, {useEffect, useState, useRef, useCallback} from 'react';
import { IoMenu } from "react-icons/io5";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    useMap,
    Pin
  } from '@vis.gl/react-google-maps';
  import {MarkerClusterer} from '@googlemaps/markerclusterer';
  import type {Marker} from '@googlemaps/markerclusterer';
import '../assets/styles/home.css'


interface Pins {
  id: number;
  title: string;
}

interface Group {
  id: number;
  name: string;
  pins: Pins[];
}

type Poi ={ key: string, location: google.maps.LatLngLiteral, label: string, details: string }


const groups = [
  {
    id: 1,
    name: 'Group 1',
    pins: [
      { id: 1, title: 'Pin 1' },
      { id: 2, title: 'Pin 2' },
    ],
  },
  {
    id: 2,
    name: 'Group 2',
    pins: [
      { id: 3, title: 'Pin 3' },
      { id: 4, title: 'Pin 4' },
    ],
  },
  {
    id: 3,
    name: 'Group 3',
    pins: [
      { id: 5, title: 'Pin 5' },
      { id: 6, title: 'Pin 6' },
      { id: 7, title: 'Pin 7' },
      { id: 8, title: 'Pin 8' },
    ],
  },
  {
    id: 4,
    name: 'Group 4',
    pins: [
      { id: 9, title: 'Pin 9' },
    ],
  }
];

const locations: Poi[] = [
	{
        key: 'krugerNationalPark',
        location: { lat: -23.9884, lng: 31.5547 },
        label: 'Kruger National Park',
        details: 'One of Africa\'s largest game reserves, home to the Big Five: lions, leopards, rhinos, elephants, and buffalos.'
    },
    {
        key: 'addoElephantPark',
        location: { lat: -33.4468, lng: 25.7484 },
        label: 'Addo Elephant Park',
        details: 'Famous for its large population of elephants, as well as lions, hyenas, and various antelope species.'
    },
    {
        key: 'tableMountainNationalPark',
        location: { lat: -34.0104, lng: 18.3736 },
        label: 'Table Mountain National Park',
        details: 'Known for its rich biodiversity, including the unique fynbos vegetation and various bird species.'
    },
    {
        key: 'iSimangalisoWetlandPark',
        location: { lat: -28.3820, lng: 32.4143 },
        label: 'iSimangaliso Wetland Park',
        details: 'A UNESCO World Heritage Site with diverse ecosystems, including estuaries, lakes, and wetlands, home to hippos, crocodiles, and numerous bird species.'
    },
    {
        key: 'kgalagadiTransfrontierPark',
        location: { lat: -26.2825, lng: 20.6150 },
        label: 'Kgalagadi Transfrontier Park',
        details: 'Known for its large predators, including lions, cheetahs, and leopards, as well as herds of wildebeest and springbok.'
    },
    {
        key: 'karooNationalPark',
        location: { lat: -32.2968, lng: 22.5287 },
        label: 'Karoo National Park',
        details: 'Home to a variety of desert-adapted wildlife, including gemsbok, mountain zebra, and a rich diversity of plant life.'
    },
    {
        key: 'hluhluweImfoloziPark',
        location: { lat: -28.0493, lng: 31.9189 },
        label: 'Hluhluwe-Imfolozi Park',
        details: 'The oldest proclaimed nature reserve in Africa, famous for its conservation of the white rhinoceros and also home to the Big Five.'
    },
    {
        key: 'madikweGameReserve',
        location: { lat: -24.7486, lng: 26.2418 },
        label: 'Madikwe Game Reserve',
        details: 'A malaria-free game reserve that offers sightings of the Big Five, wild dogs, and a variety of bird species.'
    },
    {
        key: 'goldenGateHighlandsNationalPark',
        location: { lat: -28.5145, lng: 28.6080 },
        label: 'Golden Gate Highlands National Park',
        details: 'Famed for its stunning sandstone formations and diverse wildlife, including elands, zebras, and vultures.'
    },
    {
        key: 'bouldersBeachPenguinColony',
        location: { lat: -34.1975, lng: 18.4510 },
        label: 'Boulders Beach Penguin Colony',
        details: 'A protected area known for its colony of African penguins, as well as scenic coastal views.'
    },
	{
        key: 'krugerNationalPark',
        location: { lat: -23.9884, lng: 31.5547 },
        label: 'Kruger National Park',
        details: 'One of Africa\'s largest game reserves, home to the Big Five: lions, leopards, rhinos, elephants, and buffalos.'
    },
    {
        key: 'addoElephantPark',
        location: { lat: -33.4468, lng: 25.7484 },
        label: 'Addo Elephant Park',
        details: 'Famous for its large population of elephants, as well as lions, hyenas, and various antelope species.'
    },
    {
        key: 'tableMountainNationalPark',
        location: { lat: -34.0104, lng: 18.3736 },
        label: 'Table Mountain National Park',
        details: 'Known for its rich biodiversity, including the unique fynbos vegetation and various bird species.'
    },
    {
        key: 'iSimangalisoWetlandPark',
        location: { lat: -28.3820, lng: 32.4143 },
        label: 'iSimangaliso Wetland Park',
        details: 'A UNESCO World Heritage Site with diverse ecosystems, including estuaries, lakes, and wetlands, home to hippos, crocodiles, and numerous bird species.'
    },
    {
        key: 'kgalagadiTransfrontierPark',
        location: { lat: -26.2825, lng: 20.6150 },
        label: 'Kgalagadi Transfrontier Park',
        details: 'Known for its large predators, including lions, cheetahs, and leopards, as well as herds of wildebeest and springbok.'
    },
    {
        key: 'karooNationalPark',
        location: { lat: -32.2968, lng: 22.5287 },
        label: 'Karoo National Park',
        details: 'Home to a variety of desert-adapted wildlife, including gemsbok, mountain zebra, and a rich diversity of plant life.'
    },
    {
        key: 'hluhluweImfoloziPark',
        location: { lat: -28.0493, lng: 31.9189 },
        label: 'Hluhluwe-Imfolozi Park',
        details: 'The oldest proclaimed nature reserve in Africa, famous for its conservation of the white rhinoceros and also home to the Big Five.'
    },
    {
        key: 'madikweGameReserve',
        location: { lat: -24.7486, lng: 26.2418 },
        label: 'Madikwe Game Reserve',
        details: 'A malaria-free game reserve that offers sightings of the Big Five, wild dogs, and a variety of bird species.'
    },
    {
        key: 'goldenGateHighlandsNationalPark',
        location: { lat: -28.5145, lng: 28.6080 },
        label: 'Golden Gate Highlands National Park',
        details: 'Famed for its stunning sandstone formations and diverse wildlife, including elands, zebras, and vultures.'
    },
    {
        key: 'bouldersBeachPenguinColony',
        location: { lat: -34.1975, lng: 18.4510 },
        label: 'Boulders Beach Penguin Colony',
        details: 'A protected area known for its colony of African penguins, as well as scenic coastal views.'
    },
    {
        key: 'rooibokKruger',
        location: { lat: -23.9884, lng: 31.5547 },
        label: 'Rooibok in Kruger',
        details: 'Commonly known as impala, the rooibok is a medium-sized antelope found in large herds in Kruger National Park.'
    },
    {
        key: 'blueWildebeestKgalagadi',
        location: { lat: -26.2825, lng: 20.6150 },
        label: 'Blue Wildebeest in Kgalagadi',
        details: 'Known for their migratory behavior and massive herds, blue wildebeest are frequently seen in Kgalagadi Transfrontier Park.'
    },
    {
        key: 'springbokKaroo',
        location: { lat: -32.2968, lng: 22.5287 },
        label: 'Springbok in Karoo',
        details: 'A small, fast antelope known for its leaping display, the springbok is a common sight in Karoo National Park.'
    },
    {
        key: 'elephantAddo',
        location: { lat: -33.4468, lng: 25.7484 },
        label: 'Elephants in Addo',
        details: 'Addo Elephant Park is renowned for its dense population of elephants, offering excellent viewing opportunities.'
    },
    {
        key: 'lionHluhluwe',
        location: { lat: -28.0493, lng: 31.9189 },
        label: 'Lions in Hluhluwe-Imfolozi',
        details: 'Hluhluwe-Imfolozi Park is home to a significant population of lions, providing thrilling sightings for visitors.'
    },
    {
        key: 'penguinBouldersBeach',
        location: { lat: -34.1975, lng: 18.4510 },
        label: 'Penguins at Boulders Beach',
        details: 'Boulders Beach is famous for its resident African penguin colony, a major attraction for wildlife enthusiasts.'
    }
];

const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const HomeScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false); 
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openMenuModal = () => { 
    setIsMenuModalOpen(true);
  };

  const closeMenuModal = () => { 
    setIsMenuModalOpen(false);
  };

  

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prevExpandedGroups) => ({
      ...prevExpandedGroups,
      [groupId]: !prevExpandedGroups[groupId],
    }));
  };


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <APIProvider apiKey={apicode || ''} onLoad={() => console.log('Maps API has loaded.')}>
      <div className="map-container">
          <Map
              defaultZoom={5}
              defaultCenter={ { lat: -28, lng: 23 } }
              mapId='dde51c47799889c4'
          >
              <PoiMarkers pois={locations} />
          </Map>
      </div>
      <div className="fixed top-8 left-4 z-10">
        <IoMenu size={32} onClick={openMenuModal} /> 
      </div>
      <button className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-800 sm:bottom-24 md:bottom-20" onClick={openModal}>
        +
      </button>

      {/* Add pin modal */}
      {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-4 rounded-lg">
        <button className="absolute top-0 left-0 mt-1 ml-1 p-2" onClick={closeModal}>X</button>
        <form>
          {/* Image upload square */}
          <div className="flex justify-center mb-4">
            <label htmlFor="photo-upload" className="relative cursor-pointer">
              <div className="w-32 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center rounded-md">
                {selectedImage ? (
                  <img src={selectedImage} alt="Selected" className="object-cover w-full h-full rounded-md" />
                ) : (
                  <span className="text-gray-500">Add Photo</span>
                )}
              </div>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </label>
          </div>
            {/* Input fields */}
            <div className="mt-4">
              <label htmlFor="title" className="block mb-1">Title</label>
              <input id="title" type="text" className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block mb-1">Description</label>
              <textarea id="description" className="w-full border rounded px-3 py-2"></textarea>
            </div>
            <div className="mt-4">
              <label htmlFor="group" className="block mb-1">Group</label>
              <select id="group" className="w-full border rounded px-3 py-2">
                <option value="group1">Group 1</option>
                <option value="group2">Group 2</option>
                <option value="group3">Group 3</option>
              </select>
            </div>
            <div className="flex justify-center mt-4">
                <button className="py-2 px-4 bg-gray-500 text-white rounded-full hover:bg-gray-800" onClick={closeMenuModal}>Add Pin</button>
            </div>          
            </form>
        </div>
      </div>
      )}

      {/* Menu modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg" style={{ width: "80%", maxHeight: "80vh", overflowY: "auto" }}>
            <button className="absolute top-0 left-0 mt-1 ml-1 p-2" onClick={closeMenuModal}>X</button>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Pins Displaying</h2>
              <div className="mt-2">
                <button
                  className="w-full text-left p-2 bg-gray-200 rounded mb-2"
          
                >
                  All Pins
                </button>
                {groups.map((group) => (
                  <div key={group.id}>
                    <button
                      className="w-full text-left p-2 bg-gray-200 rounded mb-2"
                      onClick={() => toggleGroup(group.id)}
                    >
                      {group.name}
                    </button>
                    {expandedGroups[group.id] && (
                      <div className="pl-4 mt-2">
                        {group.pins.map((pin) => (
                          <div key={pin.id} className="p-2 bg-gray-100 rounded mb-2">
                            {pin.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <button className="py-2 px-4 bg-gray-500 text-white rounded-full hover:bg-gray-800" onClick={closeMenuModal}>Save</button>
              </div> 
            </div>
          </div>
        </div>
      )}

      </APIProvider>
    );
  };


const PoiMarkers = (props: { pois: Poi[] }) => {
	const map = useMap();
	const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
	const clusterer = useRef<MarkerClusterer | null>(null);
  
	// Initialize MarkerClusterer, if the map has changed
	useEffect(() => {
	  if (!map) return;
	  if (!clusterer.current) {
		clusterer.current = new MarkerClusterer({map});
	  }
	}, [map]);
	
  
	// Update markers, if the markers array has changed
	useEffect(() => {
	  clusterer.current?.clearMarkers();
	  clusterer.current?.addMarkers(Object.values(markers));
	}, [markers]);
  
	const setMarkerRef = (marker: Marker | null, key: string) => {
	  if (marker && markers[key]) return;
	  if (!marker && !markers[key]) return;
  
	  setMarkers(prev => {
		if (marker) {
		  return {...prev, [key]: marker};
		} else {
		  const newMarkers = {...prev};
		  delete newMarkers[key];
		  return newMarkers;
		}
	  });
	};

  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (map) {
      setInfoWindow(new google.maps.InfoWindow());
    }
  }, [map]);

  const handleMarkerClick = useCallback((key: string) => {
	const clickedMarker = markers[key];
	if (clickedMarker && infoWindow) {
	  const clickedPoi = locations.find((poi) => poi.key === key);
	  if (clickedPoi) {
		infoWindow.close();
		const contentString = `
        <div>
          <h3>${clickedPoi.label}</h3>
          <p>${clickedPoi.details}</p>
        </div>
      `;

      infoWindow.setContent(contentString);
		infoWindow.setPosition(clickedPoi.location); // No need for .current here
		infoWindow.open(map, clickedMarker); // No need for .current here
	  }
	}
  }, [markers, infoWindow, map]);
	  
	  
  
	return (
	  <>
		{props.pois.map( (poi: Poi) => (
		  <AdvancedMarker
			key={poi.key}
			position={poi.location}
			ref={marker => setMarkerRef(marker, poi.key)}
			clickable={true}
          	onClick={() => handleMarkerClick(poi.key)}
          	
			>
			  <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
		  </AdvancedMarker>
		))}
	  </>
	 );
  };


export default HomeScreen;