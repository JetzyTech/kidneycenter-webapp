import { UseMutationResult } from "@tanstack/react-query";

export interface IHotel {
  id: string;
  name: string;
  thumbnail: string;
  price_saving_percentage: number;
  display_currency: string;
  price_non_saving: number;
  price_saving: number;
  star_rating: number;
  geo?: {
    latitude: number;
    longitude: number;
  };
}

export interface IHotelListing extends IHotel {
  docs: IHotel[];
}

export interface IDashboardCtx {
  setHotelListings: React.Dispatch<
    React.SetStateAction<{ docs: IHotelListing[] }>
  >;
  hotelListingMutation: UseMutationResult<any, Error, void, unknown>;
}
