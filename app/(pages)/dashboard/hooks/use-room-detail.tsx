import request from "@/app/lib/request";
import { useQuery } from "@tanstack/react-query";

export const fetchHotelDetail = async (hotelId: string) => {
  // https://sandbox.jetzy.com/api/v1/meetselect/hotels/707276819

  const url = `/v1/meetselect/hotels/${hotelId}`;

  try {
    const response = await request.get(url);

    if (!response.data) {
      throw new Error("No Hotels Found!");
    }

    return response.data;
  } catch (error: any) {
    console.error(error?.message);
  }
};

export const fetchHotelRooms = async (
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  rooms: number
) => {
  const url = `/v1/meetselect/hotels/rooms/list?hotel_id=${hotelId}&rooms=${rooms}&check_in=${checkIn}&check_out=${checkOut}&adults=${guests}`;

  try {
    const response = await request.get(url);

    if (!response.data) {
      throw new Error("No Hotel Rooms Found!");
    }

    return response.data;
  } catch (error: any) {
    console.error(error?.message);
  }
};

const useHotelDetail = (
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  rooms: number
) => {
  return useQuery<HotelDetail, Error>({
    queryKey: ["hotel-detail", hotelId],
    queryFn: () => fetchHotelDetail(hotelId),
    enabled: !!hotelId,
  });
};

export default useHotelDetail;
