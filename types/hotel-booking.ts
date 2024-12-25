export interface BookingPayload {
  cvc_code: string;
  country_code: string;
  start_date: string;
  end_date: string;
  card_type: string;
  card_number: string;
  card_holder: string;
  phone_number: string;
  post_code: string;
  address: string;
  city: string;
  expires_year: string;
  expires_month: string;
  email: string;
  name_first: string;
  name_last: string;
  booking_request_id: string;
  external_room_id: string;
  external_hotel_id: string;
}

export interface IBooking {
  detail: {
    booking_request_id: BookingPayload["booking_request_id"] | null;
    external_room_id: BookingPayload["external_room_id"] | null;
    external_hotel_id: BookingPayload["external_hotel_id"] | null;
  };
  room: Room;
}
export interface Room {
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
