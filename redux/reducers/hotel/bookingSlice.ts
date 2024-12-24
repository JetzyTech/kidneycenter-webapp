import { createSlice } from "@reduxjs/toolkit";
import { IBooking, Room } from "@Jetzy/types/hotel-booking";

const initialState: IBooking = {
  detail: {
    booking_request_id: null,
    external_room_id: null,
    external_hotel_id: null,
  },
  room: {
    id: null,
    title: null,
    description: null,
    rate_data: {
      ppn_bundle: null,
      price_details: {
        display_symbol: null,
        source_sub_total: null,
        source_taxes: null,
        display_all_in_total: null,
        night_price_data: [{ display_night_price: null }],
      },
    },
  } as Room,
};

export const hotelBookingSlice = createSlice({
  name: "hotelBooking",
  initialState,
  reducers: {
    setHotelBookingDetails: (state, action) => {
      state.detail = action.payload;
    },
    setSelectedRoomDetails: (state, action) => {
      state.room = action.payload;
    },
  },
});

export const { setHotelBookingDetails, setSelectedRoomDetails } =
  hotelBookingSlice.actions;
export default hotelBookingSlice;
