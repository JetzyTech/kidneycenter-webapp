import React from "react";
import { Spin } from "antd";
import { fetchHotelDetail, fetchHotelRooms } from "../../hooks/use-room-detail";
import { DetailsBackBtn } from "../../components/hotels/details-back-btn";
import Detail from "./detail";

export default async function HotelDetails({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id: hotelId } = params;
  const checkIn = searchParams.check_in as string;
  const checkOut = searchParams.check_out as string;
  const guests = Number(searchParams.guests);
  const rooms = Number(searchParams.rooms);

  const hotelData = await fetchHotelDetail(hotelId);
  const roomData = await fetchHotelRooms(
    hotelId,
    checkIn,
    checkOut,
    guests,
    rooms
  );

  return (
    <>
      <div className="max-w-sm xl:max-w-7xl mx-auto">
        <DetailsBackBtn />
        {hotelData ? (
          <Detail key={hotelId} hotelData={hotelData} roomData={roomData} />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <Spin size="large" />
          </div>
        )}
      </div>
    </>
  );
}
