"use client";

import React from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import { IHotelListing } from "../../types/dashboard.types";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { message, Spin } from "antd";

type RenderMapProps = {
  infiniteListing: UseInfiniteQueryResult<InfiniteData<IHotelListing>, unknown>;
  lat: number;
  lng: number;
};

export const RenderMap = ({ infiniteListing, lat, lng }: RenderMapProps) => {
  const [currentUserLocation, setCurrentUserLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [isLocationReady, setIsLocationReady] = React.useState(false);
  React.useEffect(() => {
    let watchId: number | null = null;

    message.info("Getting your location, Hold tight", 2);
    if (typeof window !== "undefined" && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationReady(true);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message.error("User denied geolocation permission.");
              break;
            case error.POSITION_UNAVAILABLE:
              message.error("Position unavailable.");
              break;
            case error.TIMEOUT:
              message.error("Geolocation request timed out.");
              break;
          }
          setIsLocationReady(true);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setIsLocationReady(true);
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const center = {
    lat: lat || currentUserLocation?.lat || 0,
    lng: lng || currentUserLocation?.lng || 0,
  };

  if (!isLocationReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Map
      key={
        infiniteListing.data
          ? JSON.stringify(infiniteListing.data.pages)
          : "default"
      }
      defaultZoom={10}
      defaultCenter={center}
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
  );
};
