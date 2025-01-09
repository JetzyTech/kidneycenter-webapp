"use client";

import React from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IHotelListing } from "../../types/dashboard.types";
import { Spin } from "antd";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

export const RenderMap = ({
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
    if (typeof window !== "undefined" && navigator.geolocation) {
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

  // if (!infiniteListing.data || !infiniteListing.data.pages) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
      libraries={["marker"]}
      onLoad={() => console.log("Maps API has loaded.")}
      onError={(error) => console.error("Map Error: ", error)}
    >
      <Map
        key={JSON.stringify(infiniteListing?.data?.pages)}
        defaultZoom={10}
        defaultCenter={{
          lat: lat || (currentUserLocation ? currentUserLocation.lat : lat),
          lng: lng || (currentUserLocation ? currentUserLocation.lng : lng),
        }}
        className="w-full h-screen xl:w-[50vw] xl:h-[683px]"
      >
        {infiniteListing.data?.pages?.map((page) =>
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
