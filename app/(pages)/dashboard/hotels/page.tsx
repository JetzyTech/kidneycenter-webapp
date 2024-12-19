"use client";

import {
  ArrowRight,
  CheckmarkSVG,
  ChevronLeftSVG,
  ChevronRightSVG,
  DirectionSVG,
  Pins,
} from "@/app/assets/icons";
import { Button, Typography, Rate, Tag } from "antd";
import Image from "next/image";
import { data } from "./data";
import { parseAsString, useQueryState } from "nuqs";
import { cn } from "@/app/lib/helper";
import React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export default function HotelDetails() {
  const [selectedImageIdx, setSelectedImageIdx] = React.useState(0);
  const [selectedDeal, setSelectedDeal] = useQueryState(
    "deal",
    parseAsString.withDefault("")
  );

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
                {data.data.name}
              </Typography.Text>
              <Rate defaultValue={5} />

              <div className="flex gap-x-3">
                <Image
                  src={data.data.photo_data[selectedImageIdx]}
                  alt={data.data.name}
                  width={732}
                  height={393}
                  className="object-cover w-[732px] h-[393px]"
                />
                <div className="h-[393px] overflow-y-scroll space-y-3">
                  {data.data.photo_data.map((photo, idx) => (
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
                        alt={data.data.name}
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
                    {data.data.hotel_description}
                  </Typography.Text>
                </div>
                <div className="space-y-5">
                  <Typography.Text className="font-medium text-xl">
                    Amenities
                  </Typography.Text>
                  <div className="flex flex-wrap gap-2">
                    {data.data.amenity_data.map((entry) => (
                      <Tag
                        key={entry.id}
                        className="w-max px-2 py-1 bg-[#F6F6F6] text-[#0A141B]"
                        bordered={false}
                      >
                        {entry.name}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-x-1">
                    <Pins />
                    <Typography.Text className="text-[#0A141B]">
                      {data.data.address.one_line}
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
                    >
                      <Map
                        key="1"
                        defaultZoom={15}
                        defaultCenter={{
                          lat: Number(data.data.geo.latitude),
                          lng: Number(data.data.geo.longitude),
                        }}
                        style={{ width: "100%", height: "320px" }}
                      >
                        <Marker
                          key={data.data.name}
                          position={{
                            lat: Number(data.data.geo.latitude),
                            lng: Number(data.data.geo.longitude),
                          }}
                          title={data.data.name}
                        />
                      </Map>
                    </APIProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <DealsCard
              selectedDeal={selectedDeal}
              setSelectedDeal={setSelectedDeal}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const DealsCard = ({
  selectedDeal,
  setSelectedDeal,
}: {
  selectedDeal: string;
  setSelectedDeal: (dealId: string) => void;
}) => {
  return (
    <>
      <div
        className={cn(
          "relative border rounded-xl w-[444px] h-max p-3 cursor-pointer",
          selectedDeal === "abc"
            ? "bg-secondary border-primary"
            : "bg-white border-[#C0C0C0]"
        )}
        onClick={() => setSelectedDeal("abc")}
      >
        {selectedDeal === "abc" && (
          <div className="absolute top-3 right-3">
            <CheckmarkSVG />
          </div>
        )}
        <div className="flex flex-col gap-y-3">
          <Typography.Text className="font-medium text-xl">
            Single Queen
          </Typography.Text>
          <Typography.Text className="text-[#5A5A5A]">
            luxury in our exquisite hotel suite, featuring a spacious bedroom
            and a lavish bathroom equipped with a deep soaking tub and
            breathtaking views of the skyline.
          </Typography.Text>

          <Typography.Text className="font-semibold">
            <span className="text-muted line-through">$200</span>
            &nbsp;$129/night
          </Typography.Text>
        </div>
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm">
              1 Room x 1 Night
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm">
              $129
            </Typography.Text>
          </div>
          <div className="flex items-center justify-between">
            <Typography.Text className="text-[#5A5A5A] text-sm font-bold">
              Total
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-sm font-bold">
              $129
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
