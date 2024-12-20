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
  detail: Partial<{
    [K in keyof BookingPayload]: BookingPayload[K] | null;
  }>;
}