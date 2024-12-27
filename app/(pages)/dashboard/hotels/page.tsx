"use client";

import React, { Suspense } from "react";
import request from "@/app/lib/request";
import { Button, message, Spin, Typography } from "antd";
import { IHotelListing } from "../types/dashboard.types";
import { Filters } from "../components/hotels/filters";
import { HotelCard } from "../components/hotels/hotel-card";
import { DashboardContext } from "../hooks/use-dashboard-context";
import { useFilter } from "../hooks/use-filter";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarkerProps,
  useAdvancedMarkerRef,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LOGIN, useAppDispatch } from "@Jetzy/redux";
import { useInView } from "react-intersection-observer";

export default function Dashboard() {
  const [hotelListings, setHotelListings] = React.useState<{
    docs: IHotelListing[];
  }>({ docs: [] });
  const [currentUserLocation, setCurrentUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { checkIn, checkOut, rooms, guests, lat, lng } = useFilter();
  const router = useRouter();
  const session = useSession();
  const dispatcher = useAppDispatch();
  const { ref, inView } = useInView();

  const getHotelListings = async ({ page }: { page: string }) => {
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

  const infiniteListing = useInfiniteQuery({
    queryKey: ["infinite:listing"],
    queryFn: ({ pageParam = 1 }) =>
      getHotelListings({ page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return lastPage.nextPage;
      }
      return undefined;
    },
  });

  const onHotelSelect = (id: string) => {
    const queryParams = {
      check_out: checkOut,
      check_in: checkIn,
      rooms: String(rooms),
      guests: String(guests),
      lat: String(lat),
      lng: String(lng),
    };

    // Redirect to the hotel details page with all existing query params
    router.push(`/dashboard/hotels/${id}?${new URLSearchParams(queryParams)}`);
  };

  React.useEffect(() => {
    console.log("Checking geolocation support...");

    if (navigator.geolocation) {
      console.log("Geolocation is supported. Requesting location...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location retrieved successfully:", position);
          setCurrentUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

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
    if (inView && infiniteListing.hasNextPage) {
      infiniteListing.fetchNextPage();
    }
  }, [inView, infiniteListing.hasNextPage, infiniteListing.fetchNextPage]);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <DashboardContext.Provider value={{ setHotelListings, infiniteListing }}>
        <div className="space-y-5">
          <div>
            <Typography.Text className="text-[32px] font-semibold">
              Explore Hotels
            </Typography.Text>
          </div>

          <Filters />

          {infiniteListing.isPending ? (
            <div className="flex items-center justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-x-10 w-full">
              <div className="space-y-5 w-2/5 h-[683px] overflow-y-scroll">
                {infiniteListing.data?.pages?.map((page) =>
                  page.docs?.map((entry: IHotelListing) => (
                    <div
                      key={entry.id}
                      className="cursor-pointer"
                      onClick={() => onHotelSelect(entry.id)}
                    >
                      <HotelCard entry={entry} />
                    </div>
                  ))
                )}

                <div
                  ref={ref}
                  className="h-10 flex justify-center items-center"
                >
                  {infiniteListing.isFetchingNextPage ? (
                    <div className="flex items-center justify-center">
                      <Spin />
                    </div>
                  ) : infiniteListing.hasNextPage ? (
                    <Typography.Text className="text-muted flex items-center justify-center text-sm">
                      Scroll to load more
                    </Typography.Text>
                  ) : (
                    <Typography.Text className="text-muted text-sm">
                      No records to show
                    </Typography.Text>
                  )}
                </div>
              </div>
              <div className="pr-10 w-3/5">
                <APIProvider
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
                  libraries={["marker"]}
                >
                  <Map
                    key={JSON.stringify(infiniteListing.data?.pages)}
                    defaultZoom={12}
                    defaultCenter={{ lat: Number(lat), lng: Number(lng) }}
                    style={{ width: "50vw", height: "683px" }}
                  >
                    {infiniteListing.data?.pages.map((page) =>
                      page.docs.map((entry: IHotelListing) => {
                        const latitude = Number(entry.geo?.latitude);
                        const longitude = Number(entry.geo?.longitude);
                        const position = { lat: latitude, lng: longitude };
                        if (!isNaN(latitude) && !isNaN(longitude)) {
                          return (
                            <Marker
                              key={entry.id}
                              position={position || currentUserLocation}
                              title={entry.name}
                            />
                          );
                        }
                      })
                    )}
                  </Map>
                </APIProvider>
              </div>
            </div>
          )}
        </div>
      </DashboardContext.Provider>
    </Suspense>
  );
}

const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const { children, onMarkerClick, ...advancedMarkerProps } = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      // onClick={() => {
      //   if (marker) {
      //     onMarkerClick?.(marker);
      //   }
      // }}
      ref={markerRef}
      {...advancedMarkerProps}
    >
      {children}
    </AdvancedMarker>
  );
};
