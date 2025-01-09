"use client";

import React, { Suspense } from "react";
import request from "@/app/lib/request";
import { message, Spin, Typography } from "antd";
import { Filters } from "../components/hotels/filters";
import { DashboardContext } from "../hooks/use-dashboard-context";
import { useFilter } from "../hooks/use-filter";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LOGIN, useAppDispatch } from "@Jetzy/redux";

import {
  useInfiniteQuery,
  InfiniteQueryObserverResult,
  InfiniteData,
} from "@tanstack/react-query";
import { ListingDrawer } from "./_components/listing-drawer";
import { Listing } from "./_components/listings";
import { RenderMap } from "./_components/map";
import { IHotelListing } from "../types/dashboard.types";

const getHotelListings = async ({
  page,
  rooms,
  guests,
  checkIn,
  checkOut,
  lng,
  lat,
}: {
  page: string;
  rooms: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  lat: string;
  lng: string;
}) => {
  const url = `/v1/meetselect/hotels?rooms=${rooms}&perPage=10&page=${page}&adults=${guests}&check_in=${checkIn}&check_out=${checkOut}&latitude=${lat}&longitude=${lng}`;
  try {
    const result = await request.get(url);

    if (!result) message.error("No Hotels Found!");

    return result.data;
  } catch (error: any) {
    console.error(error?.message);
    message.error(error.message);
  }
};

export default function Dashboard() {
  const {
    checkIn,
    checkOut,
    rooms,
    guests,
    lat,
    lng,
    selectedStars,
    sortPrice,
    urlPriceRange,
  } = useFilter();
  const session = useSession();
  const dispatcher = useAppDispatch();
  const searchParams = useSearchParams();

  const infiniteListing: InfiniteQueryObserverResult<
    InfiniteData<IHotelListing>,
    Error
  > = useInfiniteQuery({
    gcTime: 0,
    initialPageParam: 1,
    queryKey: ["infinite:listing", checkIn, checkOut, lat, lng, guests, rooms],
    queryFn: ({ pageParam = 1 }) =>
      getHotelListings({
        page: String(pageParam),
        rooms,
        guests,
        checkIn,
        checkOut,
        lng,
        lat,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.nextPage) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    enabled: !!checkIn && !!checkOut && !!lat && !!lng && !!guests && !!rooms,
  });

  React.useEffect(() => {
    if (session?.status === "authenticated") {
      try {
        dispatcher(LOGIN(session?.data?.user));
      } catch (error) {
        console.error("Error during session handling:", error);
      }
    }
  }, [session?.status]);

  React.useEffect(() => {
    const checkIn = searchParams.get("check_in");
    const checkOut = searchParams.get("check_out");
    const guests = searchParams.get("adults");
    const rooms = searchParams.get("rooms");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (checkIn && checkOut && guests && rooms && lat && lng) {
      infiniteListing.refetch();
    }
  }, [checkIn, checkOut, guests, rooms, lat, lng]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <DashboardContext.Provider value={{ infiniteListing, lat, lng }}>
        <div className="relative space-y-5">
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
            <ListingDrawer />
          </div>
          <Typography.Text className="hidden xl:block text-[32px] font-semibold">
            Explore Hotels
          </Typography.Text>

          <div className="hidden xl:block">
            <Filters />
          </div>
          <div className="flex items-start justify-between gap-x-10 w-full">
            <div className="hidden xl:block">
              <Listing />
            </div>
            <div className="w-full xl:w-3/5 xl:pr-10">
              <RenderMap
                infiniteListing={infiniteListing}
                lat={Number(lat)}
                lng={Number(lng)}
              />
            </div>
          </div>
        </div>
      </DashboardContext.Provider>
    </Suspense>
  );
}
