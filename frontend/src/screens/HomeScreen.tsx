import React, {useEffect, useState, useRef, useCallback} from 'react';
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

type Poi ={ key: string, location: google.maps.LatLngLiteral, label: string, details: string }
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

const HomeScreen = () => (
	
 <APIProvider apiKey={'AIzaSyAZ8zvB0pQDZ77jJl87Kio6gVGVG3JMrRw'} onLoad={() => console.log('Maps API has loaded.')}>
	<div className="map-container">
	<Map
		defaultZoom={5}
		defaultCenter={ { lat: -28, lng: 23 } }
		mapId='dde51c47799889c4'
		>
		<PoiMarkers pois={locations} />
	</Map>
	</div>
 </APIProvider>
);

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