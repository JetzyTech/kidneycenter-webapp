"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/app/lib/helper";
import { Button, Typography, Rate, Tag, Form, DatePicker, message, Spin } from "antd";
import { parseAsString, useQueryState } from "nuqs";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useFilter } from "../hooks/use-filter";
import { Counter } from "../components/counter";
import request from "@/app/lib/request";
import { useQuery } from "@tanstack/react-query";
import {
  CheckmarkSVG,
  ChevronLeftSVG,
  ChevronRightSVG,
  DirectionSVG,
  Pins,
} from "@/app/assets/icons";

export default function HotelDetails() {
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
  const [selectedDeal, setSelectedDeal] = useQueryState(
    "deal",
    parseAsString.withDefault("")
  );

  const {checkIn, checkOut, rooms, guests} = useFilter()

  const getHotelDetail = async () => {
    const url = `/v1/meetselect/hotels/rooms/list?hotel_id=701282362&rooms=2&check_in=2024-12-19&check_out=2024-12-29&adults=2`

    try {
      const result = await request.get(url);

      if (!result) {
        message.error("No Hotels Found!");
        return {};
      }

      return result.data;
    } catch (error: any) {
      console.error(error?.message);
      message.error(error.message);
      return {}; 
    }
  };

  const {data, isLoading} = useQuery<HotelDetail>({
    queryKey: ["hotel-detail"],
    queryFn: getHotelDetail,
  })

  console.log({data})

  if (isLoading) {
    return <Spin size="large" />
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-x-2">
          <div className="border border-[#ededed] rounded-lg px-1">
            <ChevronLeftSVG />
          </div>
          <Typography.Text className="font-semibold text-base">
            Details
          </Typography.Text>
        </div>
        <div className="flex items-start justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-col mt-10 space-y-5">
              <Typography.Text className="text-[28px] font-bold">
                {data?.name}
              </Typography.Text>
              <Rate defaultValue={data?.star_rating} className="text-primary" />

              <div className="flex gap-x-3">
                <Image
                  src={data?.photo_data[selectedImageIdx] ?? ''}
                  alt={data?.name ?? ''}
                  width={732}
                  height={393}
                  className="object-cover w-[732px] h-[393px]"
                />
                <div className="h-[393px] overflow-y-scroll space-y-3">
                  {data?.photo_data.map((photo, idx) => (
                    <div
                      key={photo}
                      className={cn(
                        selectedImageIdx === idx
                          ? "border-2 border-primary rounded-lg"
                          : ""
                      )}
                    >
                      <Image
                        src={photo}
                        alt={data?.name}
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
                    {data?.hotel_description}
                  </Typography.Text>
                </div>
                <div className="space-y-5">
                  <Typography.Text className="font-medium text-xl">
                    Amenities
                  </Typography.Text>
                  {data?.amenity_data?.length === 0 ? 
                  <Typography.Text>No Amemity found</Typography.Text>
                  :
                  <div className="flex flex-wrap gap-2">
                    {data?.amenity_data?.map((entry) => (
                      <Tag
                        key={entry.id}
                        className="w-max px-2 py-1 bg-[#F6F6F6] text-[#0A141B]"
                        bordered={false}
                      >
                        {entry.name}
                      </Tag>
                    ))}
                  </div>
}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-1">
                    <Pins />
                    <Typography.Text className="text-[#0A141B]">
                      {data?.address?.one_line}
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
                      libraries={["marker"]}
                      apiKey={
                        process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string
                      }
                    >
                      <Map
                        key="1"
                        defaultZoom={15}
                        defaultCenter={{
                          lat: Number(data?.geo.latitude),
                          lng: Number(data?.geo.longitude),
                        }}
                        style={{ width: "100%", height: "320px" }}
                      >
                        <Marker
                          key={data?.name}
                          position={{
                            lat: Number(data?.geo.latitude),
                            lng: Number(data?.geo.longitude),
                          }}
                          title={data?.name}
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

            {data?.room_data?.map((room) => (
              <RoomDetail
                selectedDeal={selectedDeal}
                setSelectedDeal={setSelectedDeal}
                room={room}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const RoomDetail = ({
  selectedDeal,
  setSelectedDeal,
  room
}: {
  selectedDeal: string;
  setSelectedDeal: (dealId: string) => void;
  room: Room
}) => {
  console.log({room})
  return (
    <>
      <div
        className={cn(
          "relative border rounded-xl w-[444px] h-max p-3 cursor-pointer",
          selectedDeal === room.id
            ? "bg-secondary border-primary"
            : "bg-white border-[#C0C0C0]"
        )}
        onClick={() => setSelectedDeal(room.id)}
      >
        {selectedDeal === "abc" && (
          <div className="absolute top-3 right-3">
            <CheckmarkSVG />
          </div>
        )}
        <div className="flex flex-col gap-y-3">
          <Typography.Text className="font-medium text-xl">
           {room?.title}
          </Typography.Text>
          <Typography.Text className="text-[#5A5A5A]">
            {room?.description}
          </Typography.Text>

          <Typography.Text className="font-semibold">
            <span className="text-muted line-through">$200</span>
            &nbsp;{room?.rate_data?.price_details?.display_symbol}{room?.rate_data?.price_details?.night_price_data[0]?.display_night_price}/night
          </Typography.Text>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm">
              1 Room x 1 Night
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm">
              ${room?.rate_data?.price_details?.source_sub_total}
            </Typography.Text>
          </div>
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm">
             Taxes and fees
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm">
            {room?.rate_data?.price_details?.display_symbol} {room?.rate_data?.price_details?.source_taxes}
            </Typography.Text>
          </div>
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm font-bold">
              Total
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm font-bold">
             {room?.rate_data?.price_details?.display_symbol} {room?.rate_data?.price_details?.display_all_in_total}
            </Typography.Text>
          </div>
        </div>
        <div className="flex justify-end mt-5 gap-x-3">
          <Button
            type="text"
            variant="text"
            className="text-primary underline font-semibold p-0"
            iconPosition="end"
            icon={<ChevronRightSVG />}
          >
            Policy Details
          </Button>
          <Button
            type="text"
            variant="text"
            className="text-primary underline font-semibold p-0"
            iconPosition="end"
            icon={<ChevronRightSVG />}
          >
            Room Details
          </Button>
        </div>
      </div>
    </>
  );
};

const Filters = () => {
  const { checkIn, checkOut, rooms, guests, updateField } = useFilter();

  return (
    <>
    <div className="text-end mt-10">
      <Button size="large" type="primary" className="font-medium w-max">
        Proceed to Checkout
      </Button>
      </div>
      <Form colon={false} layout="vertical" className="flex flex-col">
        <div className="flex items-center gap-x-2">
          <Form.Item
            className="w-[200px]"
            label={
              <Typography.Text className="text-base font-medium">
                When
              </Typography.Text>
            }
          >
            <DatePicker.RangePicker
              size="large"
              format="YYYY-MM-DD"
              onChange={(dates, dateStrings) => {
                updateField("checkIn", dateStrings[0]);
                updateField("checkOut", dateStrings[1]);
              }}
              className="bg-[#F9F9F9] border-[#C0C0C0]"
            />
          </Form.Item>

          <Form.Item
            label={
              <Typography.Text className="text-base font-medium">
                Rooms
              </Typography.Text>
            }
          >
            <Counter
              className="w-[110px]"
              count={Number(rooms)}
              setCount={(value) => updateField("rooms", value)}
              iconHeight={16}
              iconWidth={16}
            />
          </Form.Item>
          <Form.Item
            label={
              <Typography.Text className="text-base font-medium">
                Guests
              </Typography.Text>
            }
          >
            <Counter
              className="w-[110px]"
              count={Number(guests)}
              setCount={(value) => updateField("guests", value)}
              iconHeight={16}
              iconWidth={16}
            />
          </Form.Item>
        </div>

<div className="text-end">
        <Button type="text" variant="text" className="w-max text-primary font-bold p-0">Apply Filters</Button>
        </div>
      </Form>
    </>
  );
};
