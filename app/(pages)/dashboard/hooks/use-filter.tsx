import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import React from "react";

interface IFilter {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  sortPrice: string;
  urlPriceRange: number;
  priceRange: [number, number];
  tempPriceRange: [number, number];
  selectedStars: number;
  lat: string;
  lng: string;
  updateField: (field: keyof IFilter, value: any) => void;
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setSortPrice: React.Dispatch<React.SetStateAction<string>>;
  setTempPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setSelectedStars: React.Dispatch<React.SetStateAction<number>>;
  setUrlPriceRange: React.Dispatch<React.SetStateAction<number>>;
}

export const useFilter = (): IFilter => {
  const [checkIn, setCheckIn] = useQueryState(
    "check_in",
    parseAsString.withDefault("")
  );
  const [checkOut, setCheckOut] = useQueryState(
    "check_out",
    parseAsString.withDefault("")
  );
  const [guests, setGuests] = useQueryState(
    "adults",
    parseAsInteger.withDefault(1)
  );
  const [rooms, setRooms] = useQueryState(
    "rooms",
    parseAsInteger.withDefault(1)
  );
  const [lat, setLat] = useQueryState("lat", parseAsString.withDefault(""));
  const [lng, setLng] = useQueryState("lng", parseAsString.withDefault(""));
  const [sortPrice, setSortPrice] = useQueryState(
    "sort",
    parseAsString.withDefault("")
  );
  const [selectedStars, setSelectedStars] = useQueryState(
    "stars",
    parseAsInteger.withDefault(0)
  );
  const [urlPriceRange, setUrlPriceRange] = useQueryState(
    "range",
    parseAsInteger.withDefault(0)
  );
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 1000,
  ]);
  const [tempPriceRange, setTempPriceRange] = React.useState<[number, number]>([
    0, 1000,
  ]);

  const updateField = React.useCallback(
    (field: string, value: any) => {
      switch (field) {
        case "checkIn":
          setCheckIn(value);
          break;
        case "checkOut":
          setCheckOut(value);
          break;
        case "guests":
          setGuests(value);
          break;
        case "rooms":
          setRooms(value);
          break;
        case "stars":
          setSelectedStars(value);
          break;
        case "sortPrice":
          setSortPrice(value);
          break;
        case "priceRange":
          setPriceRange(value);
          setUrlPriceRange(value);
          break;
        case "lat":
          setLat(value);
          break;
        case "lng":
          setLng(value);
        default:
          break;
      }
    },
    [
      checkIn,
      checkOut,
      guests,
      rooms,
      selectedStars,
      lat,
      lng,
      priceRange,
      sortPrice,
    ]
  );

  return {
    checkIn,
    checkOut,
    guests,
    rooms,
    sortPrice,
    lat,
    lng,
    setSortPrice,
    urlPriceRange,
    priceRange,
    tempPriceRange,
    selectedStars,
    updateField,
    setPriceRange,
    setTempPriceRange,
    setSelectedStars,
    setUrlPriceRange,
  };
};
