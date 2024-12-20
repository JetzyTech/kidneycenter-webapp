import React from "react";
import { Spin } from "antd";
import Detail from "./detail";
import { fetchHotelDetail } from "../../hooks/use-room-detail";
import { DetailsBackBtn } from "../../components/hotels/details-back-btn";

export default async function HotelDetails({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id: hotelId } = await await params;
  const checkIn = (await searchParams.check_in) as string;
  const checkOut = (await searchParams.check_out) as string;
  const guests = await Number(searchParams.guests);
  const rooms = await Number(searchParams.rooms);

  const data = await fetchHotelDetail(
    hotelId,
    checkIn,
    checkOut,
    guests,
    rooms
  );

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <DetailsBackBtn />
        {data ? (
          <Detail data={data} />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <Spin size="large" />
          </div>
        )}
      </div>
    </>
  );
}
