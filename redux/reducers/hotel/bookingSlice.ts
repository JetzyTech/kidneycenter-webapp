import { createSlice } from "@reduxjs/toolkit";
import { IBooking } from "@Jetzy/types/hotel-booking";

const initialState: IBooking = {
  detail: {
    booking_request_id: null,
    external_room_id: null,
    external_hotel_id: null,
  },
  // room: {
  //   id: null,
  //   name: "",
  //   description: "",
  //   rate_data: {
  //   }
  // },
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
