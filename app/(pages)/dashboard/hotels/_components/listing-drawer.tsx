"use client";

import React from "react";
import { Drawer } from "vaul";
import { Button, Tooltip, Typography } from "antd";
import { CalendarSVG, FilterSVG, MapSVG, Pins } from "@Jetzy/app/assets/icons";
import { Listing } from "./listings";
import { Filters } from "../../components/hotels/filters";
import { useFilter } from "../../hooks/use-filter";
import dayjs from "dayjs";

export const ListingDrawer = () => {
  const [open, setOpen] = React.useState(false);
  const [address, setAddress] = React.useState("");

  const {
    rooms,
    guests,
    checkIn,
    lat,
    lng,
    checkOut,
    setPriceRange,
    setTempPriceRange,
    setSelectedStars,
    setSortPrice,
    updateField,
  } = useFilter();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setOpen(true);
      else setOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    const fetchPlace = async () => {
      if (lat && lng) {
        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));

        try {
          const results = await geocoder.geocode({ location: latLng });
          if (results && results.results.length > 0) {
            setAddress(results.results[0].formatted_address || "");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          setAddress("Error fetching location");
        }
      }
    };

    fetchPlace();
  }, [lat, lng]);

  const onReset = () => {
    setSelectedStars(0);
    setSortPrice("");
    setTempPriceRange([0, 1000]);
    setPriceRange([0, 1000]);
    updateField("priceRange", "0-1000");
  };

  return (
    <>
      <Drawer.Root open={open} onClose={() => setOpen(false)}>
        <Drawer.Trigger
          asChild
          className="relative rounded-full p-4 text-xl bg-primary xl:hidden flex items-center gap-x-2 text-white shadow-2xl active:scale-95 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <Typography.Text className="text-sm">
            <MapSVG />
            Show Listings
          </Typography.Text>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="h-[calc(100vh-10rem)] bg-gray-100 flex flex-col fixed bottom-0 left-0 right-0 outline-none rounded-t-3xl overflow-y-auto z-20">
            <div className="mx-auto space-y-5 z-50">
              <Drawer.Handle className="mt-5 cursor-grabbing" />

              <Drawer.Title className="font-bold text-[27px] px-5">
                Hotels
              </Drawer.Title>

              <Drawer.NestedRoot>
                <Drawer.Trigger
                  asChild
                  className="relative rounded-full p-4 active:scale-95 cursor-pointer"
                >
                  <div className="cursor-pointer w-[360px] mx-auto px-5 py-3 border rounded-xl border-[#D7D7D7] space-y-2">
                    <div className="flex items-center justify-between gap-x-5">
                      <div className="flex flex-col items-center">
                        <Typography.Text>Where</Typography.Text>
                        <Typography.Text className="flex items-center gap-x-2">
                          <Pins stroke="#000" />
                          <Tooltip title={address}>
                            <span className="font-medium w-24 truncate">
                              {address || "Search Place"}
                            </span>
                          </Tooltip>
                        </Typography.Text>
                      </div>
                      <div className="w-[1px] h-12 bg-[#D7D7D7]" />
                      <div className="flex flex-col items-center">
                        <Typography.Text>When</Typography.Text>
                        <Typography.Text className="flex items-center gap-x-2">
                          <CalendarSVG />
                          &nbsp;
                          <span className="font-medium">
                            {formatDateToMonthDay(checkIn)}&nbsp;-&nbsp;
                            {formatDateToMonthDay(checkOut)}
                          </span>
                        </Typography.Text>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-[#D7D7D7]" />
                    <div className="flex items-center justify-between">
                      <div className="space-x-3">
                        <Typography.Text className="text-[#5A5A5A]">
                          Rooms: {rooms}
                        </Typography.Text>
                        <Typography.Text className="text-[#5A5A5A]">
                          Guests: {guests}
                        </Typography.Text>
                      </div>
                      <div className="flex items-center gap-x-1">
                        <FilterSVG />
                        <Typography.Text className="text-primary text-[13px]">
                          Edit Filters
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                </Drawer.Trigger>
                <Drawer.Portal>
                  <Drawer.Overlay className="fixed inset-0 bg-black/40" />

                  <Drawer.Content className="bg-gray-100 flex flex-col fixed bottom-0 left-0 right-0 outline-none rounded-t-3xl overflow-y-auto z-40 border-2 px-10 py-5">
                    <Drawer.Handle className="cursor-grabbing" />
                    <div className="flex items-center justify-between mt-10 mb-5">
                      <Typography.Text className="text-2xl font-semibold">
                        Filters
                      </Typography.Text>
                      <Button
                        type="text"
                        variant="text"
                        className="text-lg text-primary"
                        onClick={onReset}
                      >
                        Reset
                      </Button>
                    </div>
                    <Filters />
                  </Drawer.Content>
                </Drawer.Portal>
              </Drawer.NestedRoot>
              <Listing />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

const formatDateToMonthDay = (date: string) => dayjs(date).format("MMM DD");
