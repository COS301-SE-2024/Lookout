import React, { useEffect, useState, useRef, useCallback } from "react";
import { AdvancedMarker, useMap, Pin } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";
import { useNavigate } from "react-router-dom";

type myPin = {
  id: string;
  location: google.maps.LatLngLiteral;
  caption: string;
  category: string;
  image: string;
};

const HomePins = (props: { pin: myPin[] }) => {
  const map = useMap();
  const navigate = useNavigate(); // Use navigate for navigation
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
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

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(
    null
  );

  useEffect(() => {
    if (map) {
      setInfoWindow(new google.maps.InfoWindow());
    }
  }, [map]);

  const handleMarkerClick = useCallback(
    (key: string) => {
      const clickedMarker = markers[key];
      if (clickedMarker && infoWindow) {
        const clickedPoi = props.pin.find((pin) => pin.id === key);
        if (clickedPoi) {
          infoWindow.close();
          const contentString = `
          <div class="bg-white rounded-lg shadow-md p-4 max-w-xs">
            <h1 class="text-2xl font-semibold text-black">${clickedPoi.category}</h1>
            <img src="${clickedPoi.image}" alt="poi" class="w-full h-32 object-cover mt-2 rounded-md"/>
            <p class="text-gray-700 mt-2 text-xl">${clickedPoi.caption}</p>
            	<div class="flex justify-center">
      				<button id="view-details" class="mt-4 bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">
        				View Details
      				</button>
    			</div>
          </div>
        `;

          infoWindow.setContent(contentString);
          infoWindow.setPosition(clickedPoi.location);
          infoWindow.open(map, clickedMarker);

          // Listen for button click
          google.maps.event.addListenerOnce(infoWindow, "domready", () => {
            document
              .getElementById("view-details")
              ?.addEventListener("click", () => {
                navigate(`/post/${clickedPoi.id}`, {
                  state: { post: clickedPoi },
                });
              });
          });
        }
      }
    },
    [markers, infoWindow, map, props.pin, navigate]
  );

  return (
    <>
      {props.pin.map((poi: myPin) => (
        <AdvancedMarker
          key={poi.id}
          position={poi.location}
          ref={(marker) => setMarkerRef(marker, poi.id)}
          clickable={true}
          onClick={() => handleMarkerClick(poi.id)}
        >
          <Pin
            background={"#FA0606"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default HomePins;
