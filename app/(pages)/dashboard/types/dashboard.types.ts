import { UseInfiniteQueryResult } from "@tanstack/react-query";

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

interface InfiniteData<T> {
  pages: T[];
  pageParams: unknown[];
}

export interface IHotelListing extends IHotel {
  docs: IHotel[];
}

export interface IDashboardCtx {
  setHotelListings: React.Dispatch<
    React.SetStateAction<{ docs: IHotelListing[] }>
  >;
  infiniteListing: UseInfiniteQueryResult<InfiniteData<IHotelListing>, unknown>;
}
