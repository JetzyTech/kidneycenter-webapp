"use client";

import { Pins } from "@/app/assets/icons";
import { useFilter } from "../../hooks/use-filter";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";

export default function PlacesAutocomplete() {
  const [inputValue, setInputValue] = useState("");
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { updateField } = useFilter();

  useEffect(() => {
    if (typeof google !== "undefined" && inputRef.current) {
      if (google.maps?.places?.Autocomplete) {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          console.log({ lat, lng });
          setInputValue(place.formatted_address || "");
          updateField("lng", lng);
          updateField("lat", lat);
        });
      } else {
        console.error("Google Maps Places library not loaded.");
      }
    }
  }, [inputRef.current]);

  const getPlaceFromCoordinates = useCallback(async () => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      const geocoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

      try {
        const { results } = await geocoder.geocode({ location: latLng });
        if (results && results.length > 0) {
          setInputValue(results[0].formatted_address || "");
        }
      } catch (error) {
        console.error("Geocoding error: ", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    getPlaceFromCoordinates();
  }, [getPlaceFromCoordinates]);

  return (
    <div className="relative w-max">
      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        placeholder="Search Location"
        className="border border-[#C0C0C0] p-2 w-[330px] xl:w-[280px] rounded-lg bg-[#F9F9F9]"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="absolute top-[10px] right-1 pointer-events-none bg-[#f9f9f9]">
        <Pins width={20} height={20} />
      </div>
    </div>
  );
}
