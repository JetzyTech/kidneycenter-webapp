import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import React from "react";

interface IFilter {
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  sortPrice: string;
  priceRange: [number, number];
  tempPriceRange: [number, number];
  selectedStars: number[];
  placesOptions: { label: string; value: string }[];
  updateField: (field: keyof IFilter, value: any) => void;
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setSortPrice: React.Dispatch<React.SetStateAction<string>>;
  setTempPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setSelectedStars: React.Dispatch<React.SetStateAction<number[]>>;
  setPlacesOptions: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
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
  const [sortPrice, setSortPrice] = React.useState<string>("Any");
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 1000,
  ]);
  const [tempPriceRange, setTempPriceRange] = React.useState<[number, number]>([
    0, 1000,
  ]);
  const [selectedStars, setSelectedStars] = React.useState<number[]>([]);
  const [placesOptions, setPlacesOptions] = React.useState<
    { label: string; value: string }[]
  >([]);

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
        case "prices":
          setSortPrice(value);
          break;
        case "star_ratings":
          setSortPrice(value);
          break;
        case "price_range":
          setSortPrice(value);
          break;
        default:
          break;
      }
    },
    [checkIn, checkOut, guests, rooms]
  );

  return {
    checkIn,
    checkOut,
    guests,
    rooms,
    sortPrice,
    setSortPrice,
    priceRange,
    tempPriceRange,
    selectedStars,
    placesOptions,
    updateField,
    setPriceRange,
    setTempPriceRange,
    setSelectedStars,
    setPlacesOptions,
  };
};
