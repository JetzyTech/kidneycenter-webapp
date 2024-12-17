export interface IHotel {
  id: string;
  name: string;
  thumbnail: string;
  price_saving_percentage: number;
  display_currency: string;
  price_non_saving: number;
  price_saving: number;
  star_rating: number;
}

export interface IHotelListing {
  docs: {
    id: string;
    name: string;
    thumbnail: string;
    price_saving_percentage: number;
    display_currency: string;
    price_non_saving: number;
    price_saving: number;
    star_rating: number;
  }[];
}

export interface IDashboardCtx {
  setHotelListings: React.Dispatch<React.SetStateAction<IHotelListing[]>>;
}

