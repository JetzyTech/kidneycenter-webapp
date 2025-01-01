"use client";

import React, { Suspense } from "react";
import request from "@/app/lib/request";
import { message, Spin, Typography } from "antd";
import { IHotelListing } from "../types/dashboard.types";
import { Filters } from "../components/hotels/filters";
import { HotelCard } from "../components/hotels/hotel-card";
import { DashboardContext } from "../hooks/use-dashboard-context";
import { useFilter } from "../hooks/use-filter";
import {
  useInfiniteQuery,
  InfiniteQueryObserverResult,
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import {
  APIProvider,
  Map,
  Marker,
  AdvancedMarkerProps,
  useAdvancedMarkerRef,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { LOGIN, useAppDispatch } from "@Jetzy/redux";
import { useInView } from "react-intersection-observer";
import {
  filterByPriceRange,
  filterByStarRating,
  sortListings,
} from "@Jetzy/app/lib/helper";

export default function Dashboard() {
  const [searchLoading, setSearchLoading] = React.useState(false);

  const {
    checkIn,
    checkOut,
    rooms,
    guests,
    lat,
    lng,
    selectedStars,
    sortPrice,
    priceRange,
    urlPriceRange,
  } = useFilter();
  const router = useRouter();
  const session = useSession();
  const dispatcher = useAppDispatch();
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();

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

  const infiniteListing: InfiniteQueryObserverResult<any, any> =
    useInfiniteQuery({
      gcTime: 0,
      initialPageParam: 1,
      queryKey: ["infinite:listing"],
      queryFn: ({ pageParam = 1 }) =>
        getHotelListings({ page: String(pageParam) }),
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
  }, []);

  const getFilteredListings = (
    infiniteListing: UseInfiniteQueryResult<InfiniteData<IHotelListing>>,
    selectedStars: number | null,
    urlPriceRange: string,
    sortPrice: string
  ): IHotelListing[] => {
    const allListings =
      infiniteListing.data?.pages?.flatMap((page: any) => page.docs) || [];

    let filteredListings = allListings;

    if (selectedStars !== null) {
      filteredListings = filterByStarRating(filteredListings, selectedStars);
    }

    if (urlPriceRange) {
      filteredListings = filterByPriceRange(filteredListings, urlPriceRange);
    }

    if (sortPrice) {
      filteredListings = sortListings(filteredListings, sortPrice);
    }

    return filteredListings;
  };

  const filteredAndSortedListings = getFilteredListings(
    infiniteListing,
    selectedStars,
    urlPriceRange,
    sortPrice
  );

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <DashboardContext.Provider value={{ infiniteListing }}>
        <div className="space-y-5">
          <div>
            <Typography.Text className="text-[32px] font-semibold">
              Explore Hotels
            </Typography.Text>
          </div>

          <Filters />

          {searchLoading && (
            <div className="flex items-center justify-center">
              <Spin size="large" />
            </div>
          )}

          <div className="flex items-start justify-between gap-x-10 w-full">
            <div className="space-y-5 w-2/5 h-[683px] overflow-y-scroll hide-scrollbar">
              {(infiniteListing.fetchStatus === "fetching" ||
                infiniteListing.isLoading) && <Spin size="large" />}

              {filteredAndSortedListings?.map(
                (entry: any) =>
                  entry?.length === 0 && (
                    <div>
                      <Typography.Text>No Records Found...</Typography.Text>
                      <Typography.Text>
                        Please adjust your filters...
                      </Typography.Text>
                    </div>
                  )
              )}

              {filteredAndSortedListings?.map((entry: IHotelListing) => (
                <div
                  key={entry.id}
                  className="cursor-pointer"
                  onClick={() => onHotelSelect(entry.id)}
                >
                  <HotelCard entry={entry} />
                </div>
              ))}

              <div ref={ref} className="h-10 flex justify-center items-center">
                {infiniteListing.isFetchingNextPage ? (
                  <div className="flex items-center justify-center">
                    <Spin />
                  </div>
                ) : infiniteListing.hasNextPage ? (
                  <Typography.Text className="text-muted flex items-center justify-center text-sm">
                    Scroll to load more
                  </Typography.Text>
                ) : (
                  <Typography.Text className="text-muted text-lg">
                    No records to show
                  </Typography.Text>
                )}
              </div>
            </div>
            <div className="pr-10 w-3/5">
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

const RenderMap = ({
  infiniteListing,
  lat,
  lng,
}: {
  infiniteListing: UseInfiniteQueryResult<InfiniteData<IHotelListing>, unknown>;
  lat: number;
  lng: number;
}) => {
  const [currentUserLocation, setCurrentUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  if (!infiniteListing.data || !infiniteListing.data.pages) {
    return (
      <div className="flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      libraries={["marker"]}
      onLoad={() => console.log("Maps API has loaded.")}
      onError={(error) => console.error("Map Error: ", error)}
    >
      <Map
        key={JSON.stringify(infiniteListing.data.pages)}
        defaultZoom={10}
        defaultCenter={{
          lat: lat || (currentUserLocation ? currentUserLocation.lat : lat),
          lng: lng || (currentUserLocation ? currentUserLocation.lng : lng),
        }}
        style={{ width: "50vw", height: "683px" }}
      >
        {infiniteListing.data.pages.map((page) =>
          page.docs.map((entry) => {
            const latitude = Number(entry.geo?.latitude);
            const longitude = Number(entry.geo?.longitude);
            const position = { lat: latitude, lng: longitude };
            return (
              <Marker key={entry.id} position={position} title={entry.name} />
            );
          })
        )}

        {!lat && !lng && currentUserLocation && (
          <Marker
            key="user-location"
            position={currentUserLocation}
            title="Your Location"
          />
        )}
      </Map>
    </APIProvider>
  );
};
