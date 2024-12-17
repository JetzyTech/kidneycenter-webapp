"use client";
import React from "react";
import { Typography } from "antd";
import { APIProvider, Map, Marker, Pin, AdvancedMarkerProps, useAdvancedMarkerRef, AdvancedMarker } from "@vis.gl/react-google-maps";
import { IHotelListing } from "./types/dashboard.types";
import { Filters } from "./components/filters";
import { HotelCard } from "./components/hotel-card";
import { DashboardContext } from "./hooks/use-dashboard-context";


export default function Dashboard() {
  const [hotelListings, setHotelListings] = React.useState<IHotelListing[]>([]);

  return (
    <DashboardContext.Provider value={{ setHotelListings }}>
      <div className="space-y-5">
        <div>
          <Typography.Text className="text-[32px] font-semibold">
            Explore Hotels
          </Typography.Text>
        </div>

        <Filters />
        <div className="flex items-start justify-between gap-x-10 w-full">
          <div className="space-y-5 w-2/5 h-[683px] overflow-y-scroll">
            {hotelListings?.docs?.map((entry) => (
              <HotelCard key={entry.id} entry={entry} />
            ))}
          </div>
          <div className="pr-10 w-3/5">
            <APIProvider
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
              libraries={['marker']}
            >
              <Map style={{ width: "50vw", height: "683px" }} zoom={3} defaultCenter={{ lat: 53.54992, lng: 10.00678 }}>
                {hotelListings.docs?.map((entry) => {
                  const latitude = Number(entry.geo?.latitude);
                  const longitude = Number(entry.geo?.longitude);
                  const position = { lat: latitude, lng: longitude };

                  if (!isNaN(latitude) && !isNaN(longitude)) {
                    console.log('inside', {latitude, longitude})
                    return (
                      // <Marker
                      //   key={entry.id}
                      //   position={position}
                      //   title={entry.name}
                      // />
                      <AdvancedMarkerWithRef
                      // onMarkerClick={(
                      //   marker: google.maps.marker.AdvancedMarkerElement
                      // ) => onMarkerClick(id, marker)}
                      // onMouseEnter={() => onMouseEnter(id)}
                      // onMouseLeave={onMouseLeave}
                      key={entry.id}
                      // zIndex={zIndex}
                      className="custom-marker"
                      // style={{
                      //   transform: `scale(${[hoverId, selectedId].includes(id) ? 1.3 : 1})`,
                      //   transformOrigin: AdvancedMarkerAnchorPoint['BOTTOM'].join(' ')
                      // }}
                      position={position}>
                      <Pin
                        background='#22ccff'
                        borderColor='#1e89a1'
                        glyphColor='#0f677a'
                      />
                    </AdvancedMarkerWithRef>
                    );
                  }
                  return null;
                })}
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

export const AdvancedMarkerWithRef = (
  props: AdvancedMarkerProps & {
    onMarkerClick?: (marker: google.maps.marker.AdvancedMarkerElement) => void;
  }
) => {
  const {children, onMarkerClick, ...advancedMarkerProps} = props;
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <AdvancedMarker
      // onClick={() => {
      //   if (marker) {
      //     onMarkerClick?.(marker);
      //   }
      // }}
      ref={markerRef}
      {...advancedMarkerProps}>
      {children}
    </AdvancedMarker>
  );
};
