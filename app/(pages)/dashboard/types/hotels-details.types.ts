interface HotelDetail {
  id: string;
  name: string;
  hotel_description: string;
  photo_data: string[];
  amenity_data: Amenity[];
  address: Address;
  geo: GeoCoordinates;
  room_data: Room[];
  star_rating: number;
}

interface Amenity {
  id: string;
  name: string;
}

interface Address {
  one_line: string;
}

interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

interface Room {
  id: string | null;
  title: string | null;
  description: string | null;
  rate_data: RateData;
}

interface RateData {
  price_details: PriceDetails;
  ppn_bundle?: string | null;
}

interface PriceDetails {
  display_symbol: string | null;
  night_price_data: NightPriceData[];
  source_sub_total: number | null;
  source_taxes: number | null;
  display_all_in_total: number | null;
}

interface NightPriceData {
  display_night_price: number | null;
}
