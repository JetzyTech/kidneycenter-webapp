'use client';

import { Pins } from "@/app/assets/icons";
import React, { useEffect, useRef, useState } from "react";
import { useFilter } from "../hooks/use-filter";
import { useSearchParams } from "next/navigation";

export default function PlacesAutocomplete() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { updateField} = useFilter();

  const LOAD_PLACES = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places`

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      const script = document.createElement("script");
      script.src = LOAD_PLACES;
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
        getPlaceFromCoordinates();
      };
      document.body.appendChild(script);
    };

    loadGoogleMapsApi();
  }, []);

  const getPlaces = () => {
    if (!isLoaded || !inputRef.current) {
      console.error("Google Maps API is not loaded or input is not available.");
      return;
    }

    try {
      const places = new google.maps.places.Autocomplete(inputRef.current); 

      places.addListener("place_changed", () => {
        const place = places.getPlace();
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
        setInputValue(place.formatted_address || '');
        updateField('lng', lng);
        updateField('lat', lat);
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    getPlaces(); 
  };

  // TODO:
  // need ot fix this

  // const getPlaceFromCoordinates = async () => {
  //   const lat = searchParams.get('lat');
  //   const lng = searchParams.get('lng');

  //   if (lat && lng) {
  //     const geocoder = new google.maps.Geocoder();
  //     const latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

  //     try {
  //       const results = await geocoder.geocode({ location: latLng });
  //       console.log(results);
  //       if (results[0]) {
  //         setInputValue(results[0].formatted_address || ''); // Set formatted address
  //         updateField('lng', lng);
  //         updateField('lat', lat);
  //       }
  //     } catch (error) {
  //       console.error("Geocoding error: ", error);
  //     }
  //   }
  // };


  return (
    <div className="relative w-max">
      <input 
        type="text"
        ref={inputRef} 
        value={inputValue}
        onChange={handleInputChange}
        placeholder='Search Location'
        style={{ width: 200 }}
        className="border border-[#C0C0C0] p-2 rounded-lg bg-[#F9F9F9]"
      />
      <div className="absolute top-[10px] right-1 pointer-events-none">
        <Pins width={20} height={20} />
      </div>
    </div>
  );
}