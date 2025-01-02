"use client";
import { DirectionSVG, Pins } from "@/app/assets/icons";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Rate, Tag, Typography } from "antd";
import Image from "next/image";
import React from "react";
import { Filters } from "../../components/hotels/detail-filters";
import { RoomDetail } from "../../components/hotels/room-details";
import { parseAsString, useQueryState } from "nuqs";
import { cn } from "@/app/lib/helper";
import { useAppDispatch } from "@Jetzy/redux";
import {
  setHotelBookingDetails,
  setSelectedRoomDetails,
} from "@Jetzy/redux/reducers/hotel/bookingSlice";

interface RateData {
  ppn_bundle: string;
  price_details: PriceDetails;
}

interface Room {
  id: string;
  rate_data: RateData;
  title: string;
  description: string;
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

interface RoomData {
  room_data: Room[];
}

const Detail = ({
  hotelData,
  roomData,
}: {
  hotelData: HotelDetail;
  roomData: RoomData;
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
  const [selectedDeal, setSelectedDeal] = useQueryState(
    "deal",
    parseAsString.withDefault("")
  );

  const dispatch = useAppDispatch();
  const selectedRoom = roomData?.room_data?.find(
    (room) => room.id === selectedDeal
  );

  const bookingRequestId =
    selectedDeal &&
    roomData?.room_data?.find((room) => room.id === selectedDeal)?.rate_data
      ?.ppn_bundle;

  React.useEffect(() => {
    if (bookingRequestId && selectedDeal && hotelData) {
      dispatch(
        setHotelBookingDetails({
          booking_request_id: bookingRequestId,
          external_room_id: selectedDeal,
          external_hotel_id: hotelData.id,
        })
      );
    }

    if (hotelData) {
      dispatch(setSelectedRoomDetails({ ...selectedRoom }));
    }
  }, [bookingRequestId, selectedDeal, hotelData, selectedRoom]);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-col mt-10 space-y-5">
            <Typography.Text className="text-[28px] font-bold">
              {hotelData?.name}
            </Typography.Text>
            <Rate
              disabled
              defaultValue={hotelData?.star_rating}
              className="text-primary"
            />

            <div className="flex gap-x-3">
              <Image
                src={
                  (hotelData?.photo_data &&
                    hotelData?.photo_data[selectedImageIdx]) ??
                  ""
                }
                alt={hotelData?.name ?? ""}
                width={680}
                height={393}
                className="object-cover w-[680px] h-[393px]"
              />
              <div className="w-[60px] h-[393px] overflow-y-scroll space-y-3 hide-scrollbar">
                {hotelData?.photo_data?.map((photo, idx) => (
                  <div
                    key={photo}
                    className={cn(
                      "w-[60px]",
                      selectedImageIdx === idx
                        ? "border-2 border-primary rounded-lg"
                        : ""
                    )}
                  >
                    <Image
                      src={photo}
                      alt={hotelData?.name}
                      width={59}
                      height={40}
                      className="object-cover h-[40px] w-[59px] cursor-pointer rounded-md"
                      onClick={() => setSelectedImageIdx(idx)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-y-10">
              <div className="flex flex-col gap-y-3">
                <Typography.Text className="font-medium text-xl">
                  About
                </Typography.Text>
                <Typography.Text className="font-normal text-base text-muted">
                  {hotelData?.hotel_description}
                </Typography.Text>
              </div>
              <div className="space-y-5">
                <Typography.Text className="font-medium text-xl">
                  Amenities
                </Typography.Text>
                {hotelData?.amenity_data?.length === 0 ? (
                  <Typography.Text>No Amemity found</Typography.Text>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {hotelData?.amenity_data?.map((entry) => (
                      <Tag
                        key={entry.id}
                        className="w-max px-2 py-1 bg-[#F6F6F6] text-[#0A141B]"
                        bordered={false}
                      >
                        {entry.name}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-1">
                  <div>
                    <Pins />
                  </div>
                  <Typography.Text className="text-[#0A141B]">
                    {hotelData?.address?.one_line}
                  </Typography.Text>
                </div>
                <div>
                  <DirectionSVG />
                </div>
              </div>
              <div className="space-y-5">
                <Typography.Text className="font-medium text-xl">
                  Location
                </Typography.Text>

                <div>
                  <APIProvider
                    apiKey={
                      process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string
                    }
                    libraries={["marker"]}
                    onLoad={() => console.log("Maps API has loaded.")}
                    onError={(error) => console.log("Map Error: ", error)}
                  >
                    <Map
                      key="1"
                      defaultZoom={15}
                      defaultCenter={{
                        lat: Number(hotelData?.geo?.latitude),
                        lng: Number(hotelData?.geo?.longitude),
                      }}
                      style={{ width: "100%", height: "320px" }}
                    >
                      <Marker
                        key={hotelData?.name}
                        position={{
                          lat: Number(hotelData?.geo?.latitude),
                          lng: Number(hotelData?.geo?.longitude),
                        }}
                        title={hotelData?.name}
                      />
                    </Map>
                  </APIProvider>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-5">
          <Filters />

          {roomData?.room_data?.map((room) => (
            <RoomDetail
              key={room.id}
              selectedDeal={selectedDeal}
              setSelectedDeal={setSelectedDeal}
              room={room}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Detail;
