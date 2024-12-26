import React, { Suspense } from "react";
import { Spin } from "antd";
import { fetchHotelDetail } from "../../hooks/use-room-detail";
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

  const data = await fetchHotelDetail(hotelId, checkIn, checkOut, guests, rooms);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <div className="max-w-7xl mx-auto">
        <DetailsBackBtn />
        {data ? (
          <Detail key={hotelId} data={data} />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <Spin size="large" />
          </div>
        )}
      </div>
    </Suspense>
  );
}