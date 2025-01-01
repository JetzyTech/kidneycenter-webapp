import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  IHotelListing,
  SORT_PRICE,
} from "../(pages)/dashboard/types/dashboard.types";

export enum CURRENCY_SIGNS {
  USD = "USD",
  PKR = "PKR",
}

export const convertCurrencySign = (sign: CURRENCY_SIGNS): string => {
  switch (sign) {
    case CURRENCY_SIGNS.USD:
      return "$";

    case CURRENCY_SIGNS.PKR:
      return "₨";

    default:
      throw new Error("Invalid currency sign");
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to filter listings by star rating
export const filterByStarRating = (
  listings: IHotelListing[],
  selectedStars: number | null
): IHotelListing[] => {
  return listings.filter((entry: IHotelListing) => {
    const entryStarRating = Number(entry.star_rating);
    return !selectedStars || entryStarRating === Number(selectedStars);
  });
};

// Function to filter listings by price range
export const filterByPriceRange = (
  listings: IHotelListing[],
  priceRange: string
): IHotelListing[] => {
  return listings.filter((entry: IHotelListing) => {
    if (!priceRange || typeof priceRange !== "string") return;
    const entryPrice = entry.price_non_saving;
    let range;
    range = priceRange.split("-");
    return entryPrice >= Number(range[0]) && entryPrice <= Number(range[1]);
  });
};

// Function to sort listings
export const sortListings = (
  listings: IHotelListing[],
  sortPrice: string
): IHotelListing[] => {
  return listings.sort((a: IHotelListing, b: IHotelListing) => {
    if (sortPrice.toUpperCase() === SORT_PRICE.LOW_TO_HIGH) {
      return a.price_non_saving - b.price_non_saving;
    } else if (sortPrice.toUpperCase() === SORT_PRICE.HIGH_TO_LOW) {
      return b.price_non_saving - a.price_non_saving;
    }
    return 0;
  });
};
