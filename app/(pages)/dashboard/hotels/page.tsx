"use client";

import React, { Suspense } from "react";
import request from "@/app/lib/request";
import { message, Spin, Typography } from "antd";
import { IHotelListing } from "../types/dashboard.types";
import { Filters } from "../components/hotels/filters";
import { HotelCard } from "../components/hotels/hotel-card";
import { DashboardContext } from "../hooks/use-dashboard-context";
import { useFilter } from "../hooks/use-filter";
import { useMutation } from "@tanstack/react-query";
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

export default function Dashboard() {
  const [hotelListings, setHotelListings] = React.useState<{
    docs: IHotelListing[];
  }>({ docs: [] });
  const { checkIn, checkOut, rooms, guests, lat, lng } = useFilter();
  const router = useRouter();

  const getHotelListings = async () => {
    const url = `/v1/meetselect/hotels?rooms=${rooms}&perPage=10&page=1&adults=${guests}&check_in=${checkIn}&check_out=${checkOut}&latitude=${lat}&longitude=${lng}`;
    try {
      const result = await request.get(url);

      if (!result) message.error("No Hotels Found!");

      return result.data;
    } catch (error: any) {
      console.error(error?.message);
      message.error(error.message);
    }
  };

  const hotelListingMutation = useMutation({
    mutationKey: ["hotel-listings"],
    mutationFn: getHotelListings,
    onSettled: (data) => setHotelListings(data),
    onError: (error) => {
      console.error(error.message);
      message.error(error.message);
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

  // =======> [Auth Session] <======
  const session = useSession();

  const dispatcher = useAppDispatch();

  React.useEffect(() => {
    if (session?.status === "authenticated") {
      dispatcher(LOGIN(session?.data?.user));
    }
  }, [session?.status]);

  // =======> [Auth Session] <======

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <DashboardContext.Provider
        value={{ setHotelListings, hotelListingMutation }}
      >
        <div className="space-y-5">
          <div>
            <Typography.Text className="text-[32px] font-semibold">
              Explore Hotels
            </Typography.Text>
          </div>

          <Filters />

          {hotelListings?.docs?.length === 0 ||
            (hotelListings?.docs === undefined && (
              <div className="flex flex-col">
                <Typography.Text className="text-lg">
                  No Hotels Found
                </Typography.Text>
                <Typography.Text className="text-sm">
                  Please adjust your search criteria or try a different date
                  range.
                </Typography.Text>
              </div>
            ))}
          {hotelListingMutation.isPending ? (
            <div className="flex items-center justify-center">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex items-start justify-between gap-x-10 w-full">
              <div className="space-y-5 w-2/5 h-[683px] overflow-y-scroll">
                {hotelListings?.docs?.map((entry) => (
                  <div
                    key={entry.id}
                    className="cursor-pointer"
                    onClick={() => onHotelSelect(entry.id)}
                  >
                    <HotelCard entry={entry} />
                  </div>
                ))}
              </div>
              {hotelListings?.docs?.length > 0 && (
                <div className="pr-10 w-3/5">
                  <APIProvider
                    apiKey={
                      process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string
                    }
                    libraries={["marker"]}
                  >
                    <Map
                      key={1}
                      defaultZoom={12}
                      defaultCenter={{ lat: Number(lat), lng: Number(lng) }}
                      style={{ width: "50vw", height: "683px" }}
                    >
                      {hotelListings?.docs &&
                        hotelListings?.docs?.map((entry) => {
                          const latitude = Number(entry.geo?.latitude);
                          const longitude = Number(entry.geo?.longitude);
                          const position = { lat: latitude, lng: longitude };

                          if (!isNaN(latitude) && !isNaN(longitude)) {
                            return (
                              <>
                                <Marker
                                  key={entry.id}
                                  position={position}
                                  title={entry.name}
                                />
                              </>
                              // <AdvancedMarkerWithRef
                              //   // onMarkerClick={(
                              //   //   marker: google.maps.marker.AdvancedMarkerElement
                              //   // ) => onMarkerClick(id, marker)}
                              //   // onMouseEnter={() => onMouseEnter(id)}
                              //   // onMouseLeave={onMouseLeave}
                              //   key={entry.id}
                              //   // zIndex={zIndex}
                              //   className="custom-marker"
                              //   // style={{
                              //   //   transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                              //   //   transformOrigin: AdvancedMarkerAnchorPoint['BOTTOM'].join(' ')
                              //   // }}
                              //   position={position}
                              // >
                              //   <Pin
                              //     background="#22ccff"
                              //     borderColor="#1e89a1"
                              //     glyphColor="#0f677a"
                              //   />
                              // </AdvancedMarkerWithRef>
                            );
                          }
                          return null;
                        })}
                    </Map>
                  </APIProvider>
                </div>
              )}
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
