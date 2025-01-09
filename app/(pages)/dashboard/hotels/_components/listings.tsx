"use client";

import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useDashboardContext } from "../../hooks/use-dashboard-context";
import { useFilter } from "../../hooks/use-filter";
import React from "react";
import {
  InfiniteData,
  InfiniteQueryObserverResult,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { IHotelListing } from "../../types/dashboard.types";
import {
  filterByPriceRange,
  filterByStarRating,
  sortListings,
} from "@Jetzy/app/lib/helper";
import { Spin, Typography } from "antd";
import { HotelCard, MobileCard } from "../../components/hotels/hotel-card";

export const Listing = () => {
  const router = useRouter();
  const { ref, inView } = useInView();

  const { infiniteListing } = useDashboardContext();
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

  const getFilteredListings = React.useCallback(
    (
      infiniteListing: InfiniteQueryObserverResult<
        InfiniteData<IHotelListing>,
        Error
      >,
      selectedStars: number | null,
      urlPriceRange: string,
      sortPrice: string
    ): IHotelListing[] => {
      const allListings: IHotelListing[] =
        infiniteListing.data?.pages?.flatMap((page: any) => page?.docs) || [];

      let filteredListings: IHotelListing[] = allListings;

      if (selectedStars !== null) {
        filteredListings = filterByStarRating(filteredListings, selectedStars);
      }

      if (urlPriceRange) {
        filteredListings = filterByPriceRange(filteredListings, urlPriceRange);
      }

      if (sortPrice) {
        filteredListings = sortListings(filteredListings, sortPrice);
      }

      console.log({ urlPriceRange });

      if (urlPriceRange === "") {
        filteredListings = filteredListings.sort((a, b) => {
          const percentageSavingA =
            a.price_saving && a.price_non_saving
              ? (a.price_saving / a.price_non_saving) * 100
              : 0;

          const percentageSavingB =
            b.price_saving && b.price_non_saving
              ? (b.price_saving / b.price_non_saving) * 100
              : 0;

          return percentageSavingA - percentageSavingB;
        });
      }

      filteredListings = filteredListings.sort((a, b) => {
        const starA = a.star_rating || 0;
        const starB = b.star_rating || 0;
        // desc
        return starB - starA;
      });

      return filteredListings;
    },
    [infiniteListing, selectedStars, urlPriceRange, sortPrice]
  );

  const filteredAndSortedListings = getFilteredListings(
    infiniteListing,
    selectedStars,
    urlPriceRange,
    sortPrice
  );

  React.useEffect(() => {
    if (inView && infiniteListing.hasNextPage) {
      infiniteListing.fetchNextPage();
    }
  }, [inView, infiniteListing.hasNextPage, infiniteListing.fetchNextPage]);

  return (
    <>
      <div className="space-y-5 px-3 w-full max-w-sm mx-auto xl:max-w-max xl:mx-0 xl:px-0 xl:h-[683px] overflow-y-scroll hide-scrollbar">
        {(infiniteListing.fetchStatus === "fetching" ||
          infiniteListing.isLoading) && <Spin size="large" />}

        {filteredAndSortedListings?.map(
          (entry: any) =>
            entry?.length === 0 && (
              <div>
                <Typography.Text>No Records Found...</Typography.Text>
                <Typography.Text>Please adjust your filters...</Typography.Text>
              </div>
            )
        )}

        {filteredAndSortedListings?.map((entry: IHotelListing) => (
          <div
            key={entry?.id}
            className="cursor-pointer"
            onClick={() => onHotelSelect(entry?.id)}
          >
            <div className="hidden xl:inline-block xl:w-[600px]">
              <HotelCard entry={entry} />
            </div>
            <div className="xl:hidden">
              <MobileCard entry={entry} />
            </div>
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
    </>
  );
};
