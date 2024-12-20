import { createSlice } from "@reduxjs/toolkit";
import { IBooking } from "@Jetzy/types/hotel-booking";

const initialState: IBooking = {
  detail: {
    cvc_code: null,
    country_code: null,
    start_date: null,
    end_date: null,
    card_type: null,
    card_number: null,
    card_holder: null,
    phone_number: null,
    post_code: null,
    address: null,
    city: null,
    expires_year: null,
    expires_month: null,
    email: null,
    name_first: null,
    name_last: null,
    booking_request_id: null,
    external_room_id: null,
    external_hotel_id: null,
  },
};

export const hotelBookingSlice = createSlice({
  name: "hotel-booking",
  initialState,
  reducers: {
    setHotelDetails: (state, action) => {
      state.detail = action.payload;
    }
  },
});

export const { setHotelDetails } = hotelBookingSlice.actions
export default hotelBookingSlice
