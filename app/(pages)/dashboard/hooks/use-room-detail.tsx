import request from "@/app/lib/request";
import { useQuery } from "@tanstack/react-query";

export const fetchHotelDetail = async (
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  rooms: number
) => {
  const url = `/v1/meetselect/hotels/rooms/list?hotel_id=${hotelId}&rooms=${rooms}&check_in=${checkIn}&check_out=${checkOut}&adults=${guests}`;

  const response = await request.get(url);

  if (!response.data) {
    throw new Error("No Hotels Found!");
  }

  return response.data;
};

const useHotelDetail = (
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  rooms: number
) => {
  return useQuery<HotelDetail, Error>({
    queryKey: ["hotel-detail", hotelId, checkIn, checkOut, guests, rooms],
    queryFn: () => fetchHotelDetail(hotelId, checkIn, checkOut, guests, rooms),
    enabled: !!hotelId && !!checkIn && !!checkOut, 
  });
};

export default useHotelDetail;
