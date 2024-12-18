'use client';

import { Pins } from "@/app/assets/icons";
import React, { useEffect, useRef, useState } from "react";

export default function PlacesAutocomplete({setLocation}: {setLocation: (value: string) => void}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const LOAD_PLACES = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places`

  useEffect(() => {
    const loadGoogleMapsApi = () => {
      const script = document.createElement("script");
      script.src = LOAD_PLACES;
      script.async = true;
      script.onload = () => setIsLoaded(true);
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
        setLocation(place)
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    getPlaces(); 
  };

  return (
    <div className="relative">
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