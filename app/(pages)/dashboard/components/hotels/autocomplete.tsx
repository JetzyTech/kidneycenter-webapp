"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Pins } from "@Jetzy/app/assets/icons";
import { useFilter } from "../../hooks/use-filter";
import { useSearchParams } from "next/navigation";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface GooglePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: Array<{
      offset: number;
      length: number;
    }>;
    secondary_text: string;
  };
  matched_substrings: Array<{
    offset: number;
    length: number;
  }>;
  terms: Array<{
    offset: number;
    value: string;
  }>;
  types: string[];
}

interface PlaceDetails {
  address: string;
  latitude: number;
  longitude: number;
  place_id: string;
}

interface AutocompleteService {
  getPlacePredictions(
    request: {
      input: string;
      componentRestrictions?: { country: string };
      types?: string[];
    },
    callback: (
      predictions: GooglePrediction[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => void
  ): void;
}

interface PlacesService {
  getDetails(
    request: {
      placeId: string;
      fields: string[];
    },
    callback: (
      result: google.maps.places.PlaceResult | null,
      status: google.maps.places.PlacesServiceStatus
    ) => void
  ): void;
}

interface Props {
  placeholder?: string;
  types?: string[];
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => AutocompleteService;
          PlacesService: new (attrContainer: HTMLDivElement) => PlacesService;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
          };
        };
      };
    };
  }
}

const PlacesAutocomplete: React.FC<Props> = ({
  placeholder = "Enter an address",
}) => {
  const [predictions, setPredictions] = useState<GooglePrediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const autocompleteService = useRef<AutocompleteService | null>(null);
  const placesService = useRef<PlacesService | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const attributionsRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const geocodingLibrary = useMapsLibrary("geocoding");

  const { updateField } = useFilter();

  useEffect(() => {
    if (
      window.google &&
      attributionsRef.current &&
      window.google?.maps?.places?.AutocompleteService
    ) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        attributionsRef.current
      );
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails> => {
    return new Promise((resolve, reject) => {
      if (!placesService.current) {
        reject(new Error("Places service not initialized"));
        return;
      }

      placesService.current.getDetails(
        {
          placeId,
          fields: ["formatted_address", "geometry", "place_id"],
        },
        (result, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            result
          ) {
            resolve({
              address: result.formatted_address || "",
              latitude: result.geometry?.location?.lat() || 0,
              longitude: result.geometry?.location?.lng() || 0,
              place_id: result.place_id || "",
            });
          } else {
            reject(new Error(`Place details request failed: ${status}`));
          }
        }
      );
    });
  };

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInputValue(value);

    if (!value) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    if (autocompleteService.current) {
      setIsLoading(true);
      try {
        const response = await new Promise<GooglePrediction[]>(
          (resolve, reject) => {
            autocompleteService.current!.getPlacePredictions(
              {
                input: value,
              },
              (results, status) => {
                if (
                  status === window.google.maps.places.PlacesServiceStatus.OK &&
                  results
                ) {
                  resolve(results);
                } else {
                  reject(status);
                }
              }
            );
          }
        );
        setPredictions(response);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePredictionClick = async (prediction: GooglePrediction) => {
    setIsLoading(true);
    try {
      const details = await getPlaceDetails(prediction.place_id);
      setInputValue(details.address);
      updateField("lat", details.latitude);
      updateField("lng", details.longitude);
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setIsLoading(false);
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const getPlaceFromCoordinates = useCallback(async () => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng && geocodingLibrary) {
      const geocoder = new geocodingLibrary.Geocoder();
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

  const suffixIcon = isLoading ? (
    <LoadingOutlined style={{ visibility: isLoading ? "visible" : "hidden" }} />
  ) : (
    <Pins />
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        suffix={suffixIcon}
        className="border border-[#C0C0C0] p-2 w-[330px] xl:w-[280px] rounded-lg bg-[#F9F9F9]"
      />

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 w-[330px] xl:w-[280px] mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handlePredictionClick(prediction)}
            >
              <div className="text-sm text-gray-900">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="text-xs text-gray-500">
                {prediction.structured_formatting.secondary_text}
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={attributionsRef} className="hidden" />
    </div>
  );
};

export default PlacesAutocomplete;
