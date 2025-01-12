"use client";

import React from "react";
import Image from "next/image";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { Rate, Tag, Typography } from "antd";
import { Filters } from "../../components/hotels/detail-filters";
import { RoomDetail } from "../../components/hotels/room-details";
import { parseAsString, useQueryState } from "nuqs";
import { cn } from "@/app/lib/helper";
import { useAppDispatch } from "@Jetzy/redux";
import Slider from "react-slick";
import {
  setHotelBookingDetails,
  setSelectedRoomDetails,
} from "@Jetzy/redux/reducers/hotel/bookingSlice";
import {
  ChevronLeftSVG,
  ChevronRightSVG,
  DirectionSVG,
  Pins,
} from "@/app/assets/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between md:px-2">
        <div className="max-w-sm md:max-w-xl xl:max-w-3xl mx-auto xl:mx-0">
          <div className="flex flex-col mt-10 space-y-4">
            <Typography.Text className="text-[28px] font-bold">
              {hotelData?.name}
            </Typography.Text>
            <div className="bg-[#FFF8ED] xl:bg-transparent rounded-[10px] w-max">
              <Rate
                disabled
                defaultValue={hotelData?.star_rating}
                className="text-primary p-2"
              />
            </div>

            <div className="xl:hidden">
              <DetailImageCarousal images={hotelData?.photo_data} />
            </div>
            <div className="hidden xl:flex gap-x-3">
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
              <div className="hidden xl:block w-[60px] h-[393px] overflow-y-scroll space-y-3 hide-scrollbar">
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

            <div className="flex flex-col gap-y-10 px-2 md:px-0">
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
              <div className="flex items-center justify-between w-[21rem] md:w-full">
                <div className="flex items-start gap-x-1">
                  <div className="mt-1">
                    <Pins stroke="#000" />
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:items-end xl:justify-center gap-y-5 max-w-sm md:max-w-xl xl:max-w-3xl mx-auto xl:mx-0 my-10 xl:my-0">
          <Filters />

          {roomData?.room_data?.map((room) => (
            <RoomDetail
              key={room.id}
              selectedDeal={selectedDeal}
              setSelectedDeal={setSelectedDeal}
              room={room}
              className="w-[300px] sm:w-full xl:w-[444px]"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Detail;

const DetailImageCarousal: React.FC<{ images: string[] }> = ({ images }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: (
      <CustomArrow>
        <ChevronRightSVG stroke="#fff" width={16} height={16} />
      </CustomArrow>
    ),
    prevArrow: (
      <CustomArrow>
        <ChevronLeftSVG stroke="#fff" width={16} height={16} />
      </CustomArrow>
    ),
  };
  return (
    <div className="relative">
      <Slider {...settings}>
        {images?.map((photo) => (
          <div key={photo} className="w-[440px]">
            <Image
              src={photo}
              alt="hotel images jetzy"
              width={440}
              height={340}
              className="object-cover h-[340px] w-[440px] md:w-[580px] cursor-pointer rounded-md"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

function CustomArrow(props: {
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const { className, onClick, children } = props;
  return (
    <div
      className={`absolute top-1/2 transform -translate-y-1/2 z-10 cursor-pointer ${
        className?.includes("slick-next") ? "right-4" : "left-4"
      }`}
      onClick={onClick}
    >
      <div className="p-2 bg-[#00000033] rounded-full w-max backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
