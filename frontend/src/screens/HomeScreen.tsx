import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import HomePins from '../components/HomePins';
import { FaPlus } from "react-icons/fa";
import Legend from '../components/Legend';
import { Fa0 } from 'react-icons/fa6';

import CameraComponent from '../components/CameraComponent'; // Ensure this path is correct



type Poi ={ key: string, location: google.maps.LatLngLiteral, label: string, details: string }
type myPin ={ id: string, location: google.maps.LatLngLiteral, caption: string, category: string, image: string }
const legendItems = [
  { name: 'Nature Reserves', icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' },
  { name: 'Personal Pins', icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' },
];

const filtergroups = [
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
    }
];


interface CreatePostsProps {
  onCreatePost: (newPost: Post) => void;
}

interface Post {
  userid: number;
  groupid: number;
  categoryid: number;
  picture: string;
  latitude: number;
  longitude: number;
  caption: string;
  title: string;
}

type Group = { id: number, name: string, categories: { id: number, name: string }[] };

const apicode = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const handleCapture = (url: string) => {
  // Example function to shorten URL (replace with your actual implementation)
  const shortenURL = async (url: string) => {
    // Simulated URL shortening process (replace with actual implementation)
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const shortenedURL = url.substring(0, 20); // Simulated shortening
        resolve(shortenedURL);
      }, 1000); // Simulate API delay
    });
  };

  // Handle URL shortening and further processing
  shortenURL(url)
    .then(shortenedURL => {
      // Process the shortenedURL (e.g., store it in state or send it to the server)
      console.log("Shortened URL:", shortenedURL);
    })
    .catch(error => {
      console.error("Error shortening URL:", error);
    });
};

const HomeScreen: React.FC<CreatePostsProps> = ({ onCreatePost }) => {
  const id = 2;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isPhotoOptionsModalOpen, setIsPhotoOptionsModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false); // New state for camera modal
  const [expandedGroups, setExpandedGroups] = useState<{ [key: number]: boolean }>({});
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [caption, setCaption] = useState("");
  const [picture, setPicture] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const navigate = useNavigate();

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error fetching location:', error);
        }
      );
    } else {
      throw new Error('Geolocation is not supported by this browser.');
    }
  };

  const [pins, setPins] = useState<myPin[]>([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch('/api/posts', {
          method: 'GET',
          headers: {
          'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pins');
        }

        const data = await response.json();
        const formattedPins = data.content.map((pin: any) => ({
          id: pin.id,
          location: { lat: pin.latitude, lng: pin.longitude },
          caption: pin.caption,
          category: pin.category.description,
          image: pin.picture,
        }));
        setPins(formattedPins);
        console.log(formattedPins);
      } catch (error) {
        console.error('Error fetching pins:', error);
      }
    };

    fetchPins();
    
  }, []);
  

  const handleAddPinClick = async () => {
    if (selectedGroup === null) {
      alert("Please select a group.");
      return;
    }
    if (selectedCategory === null) {
      alert("Please select a category.");
      return;
    }

    const newPost = {
      userid: id,
      groupid: selectedGroup,
      categoryid: selectedCategory,
      picture: picture || "https://animalmicrochips.co.uk/images/default_no_animal.jpg",
      latitude: latitude,
      longitude: longitude,
      caption: caption,
      title: title
    };

    try {
      const response = await fetch('/api/posts/CreatePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const createdPost = await response.json();
      //console.log('Post created successfully:', createdPost);
      setCaption("");
      setTitle("");
      setPicture("");
      setSelectedGroup(null);
      setSelectedCategory(null);
      closeModal();

      onCreatePost(createdPost);
      
      setIsSuccessModalOpen(true); // Open success modal
      // setIsModalOpen(false); // Close modal after successful pin addition
      // setIsSuccessModalOpen(true); // Open success modal
      
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddPhotoClick = () => {
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
      
    }
    setIsPhotoOptionsModalOpen(false);
  };

  const handleTakePhotoClick = () => {
    setIsCameraModalOpen(true);
    setIsPhotoOptionsModalOpen(false);
  };

  const openPhotoModal = () => {
    setIsPhotoOptionsModalOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPicture(fileUrl);
    }
  };

  const openModal = () => {
    getLocation();
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
    setSelectedGroup(selectedGroup === groupId ? null : groupId);
  };


  useEffect(() => {
    fetch(`/api/groups/user/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data); // Log the data to check the response format
        setGroups(data);
      })
      .catch((error) => console.error('Error fetching groups:', error));
  }, []);


  const categories = [
    { id: 1, name: "Animal Sighting" },
    { id: 2, name: "Campsite" },
    { id: 3, name: "Hiking Trail" },
    { id: 4, name: "Security Concern" },
    { id: 5, name: "POI" },
  ];

  return (
    <APIProvider apiKey={apicode || ''} onLoad={() => console.log('Maps API has loaded.')}>
      <div className="map-container">
          <Map
              defaultZoom={5}
              defaultCenter={ { lat: -28, lng: 23 } }
              mapId='dde51c47799889c4'
          >
              <PoiMarkers pois={locations} />
              <HomePins pin={pins} />
          </Map>
          <Legend items={legendItems} />
       
      </div>
      <div className="fixed top-12 left-4 z-10" id="menu">
        <IoMenu size={32} onClick={openMenuModal} />
      </div>
      <button
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-500 text-white py-2 px-4 rounded-full hover:bg-gray-800 sm:bottom-24 md:bottom-20"
        onClick={openModal}
      >
        +
      </button>

    

      {/* Add pin modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <button className="absolute top-2 right-2 text-xl" onClick={closeModal}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Add a Pin</h2>

            <div className="flex justify-center mb-3">
              <button
                className="flex items-center justify-center w-12 h-12 border border-gray-300 rounded-lg"
                onClick={openPhotoModal}
              >
                <FaPlus />
              </button>
            </div>


            <div className="text-center mb-3">
              <span className="text-lg">Add a photo</span>
              <input
                type="file"
                accept="image/jpeg, image/png"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              {picture && (
                <img src={picture} alt="Selected" className="w-32 h-32 mt-2 mx-auto" />
              )}
            </div>

            <form>
              <div className="mb-3">
                <label
                  htmlFor="groupSelect"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Group:
                </label>
                <select
                  id="groupSelect"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedGroup ?? ""}
                  onChange={(e) => setSelectedGroup(Number(e.target.value))}
                >
                  <option value="" disabled>Select a group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="categorySelect"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Category:
                </label>
                <select
                  id="categorySelect"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory ?? ""}
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="formDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Caption:
                </label>
                <textarea
                  id="formDescription"
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="formDescription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title:
                </label>
                <textarea
                  id="formDescription"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></textarea>
              </div>
            </form>

            <div>
              <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleAddPinClick}
              >
                Add Pin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Post Created Successfully!</h2>
            <button
              className="block mx-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/'); // Redirect or navigate as needed
              }}
            >
              Okay
            </button>
          </div>
        </div>
      )}

{/* PhotoOptions modal */}
{isPhotoOptionsModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Photo</h2>
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleAddPhotoClick}
        >
          Upload A Photo
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleTakePhotoClick}
        >
          Take A Photo
        </button>
      </div>
      <button
        className="absolute top-4 right-4 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        onClick={() => setIsPhotoOptionsModalOpen(false)}
      >
        x
      </button>
    </div>
  </div>
)}

{/* Camera modal */}
{isCameraModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-white p-6 rounded-lg w-full max-w-sm mx-auto">
      <button className="absolute top-2 right-2 text-xl" onClick={() => setIsCameraModalOpen(false)}>
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Take A Photo</h2>
      <CameraComponent
        onCapture={(url) => {
          setPicture(url);
          console.log("Compressed photo URL:", url);
          setIsCameraModalOpen(false);
          console.log('testtt')
        }}
      />
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
                  className={`w-full text-left p-2 rounded mb-2 ${selectedGroup === null ? 'bg-gray-400' : 'bg-gray-200'}`}
                  onClick={() => setSelectedGroup(null)}
                >
                  All Pins
                </button>
                {filtergroups.map((group) => (
                  <div key={group.id}>
                    <button
                      className={`w-full text-left p-2 rounded mb-2 ${selectedGroup === group.id ? 'bg-gray-400' : 'bg-gray-200'}`}
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

const PoiMarkers = (props: { pois: Poi[]}) => {
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
        <div id="content">
          <div id="siteNotice" style="color: black;>
            <h1 id="firstHeading" class="firstHeading"><b>${clickedPoi.label}</b></h1>
            <p>${clickedPoi.details}</p>
          </div>
        </div>
      `;

    infoWindow.setContent(contentString);
		infoWindow.setPosition(clickedPoi.location);
		infoWindow.open(map, clickedMarker);
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
