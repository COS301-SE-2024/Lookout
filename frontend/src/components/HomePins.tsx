import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    AdvancedMarker,
    useMap,
  } from '@vis.gl/react-google-maps';
  import {MarkerClusterer} from '@googlemaps/markerclusterer';
  import type {Marker} from '@googlemaps/markerclusterer';
  import campIcon from '../assets/icons/camping-zonepin.png';
  import AnimalIcon from '../assets/icons/zoopin.png';
  import HikingIcon from '../assets/icons/mountainpin.png';
  import POIIcon from '../assets/icons/point-of-interestpin.png';
  import SecurityIcon from '../assets/icons/dangerpin.png';

type myPin ={ id: string, location: google.maps.LatLngLiteral, caption: string, category: string, image: string }

const HomePins = (props: { pin: myPin[]}) => {
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

	const getIconUrl = (category: string) => {
		switch (category) {
			case 'Campsite':
				return campIcon;
			case 'Animal Sighting':
				return AnimalIcon;
			case 'Hiking Trail':
				return HikingIcon;
			case 'POI':
				return POIIcon;
			case 'Security Concern':
				return SecurityIcon;
			default:
				return POIIcon; 
		}
	};
	
  
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
	  const clickedPoi = props.pin.find((pin) => pin.id === key);
	  if (clickedPoi) {
		infoWindow.close();
		const contentString = `
        <div id="content">
          <div id="siteNotice" style="color: black;>
            <h1 id="firstHeading" class="firstHeading"><b>${clickedPoi.category}</b></h1>
            <img src=${`data:image/png;base64,${clickedPoi.image}`} alt="poi" style="width:100px;height:50px;">
            <p>${clickedPoi.caption}</p>
          </div>
        </div>
      `;

    infoWindow.setContent(contentString);
		infoWindow.setPosition(clickedPoi.location);
		infoWindow.open(map, clickedMarker);
	  }
	}
  }, [markers, infoWindow, map, props.pin]);
	  
	  
  
	return (
	  <>
		{props.pin.map( (poi: myPin) => (
		  <AdvancedMarker
			key={poi.id}
			position={poi.location}
			ref={marker => setMarkerRef(marker, poi.id)}
			clickable={true}
            onClick={() => handleMarkerClick(poi.id)}   	
			>
			  <img src={getIconUrl(poi.category)} width={45} height={45} alt={poi.category} />
		  </AdvancedMarker>
		))}
	  </>
	 );
  };


export default HomePins;