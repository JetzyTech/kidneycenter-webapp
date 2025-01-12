"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string}
        libraries={["marker", "places"]}
        onLoad={() => console.log("Maps API has loaded.")}
        onError={(error) => console.error("Map Error: ", error)}
      >
        <div>{children}</div>
      </APIProvider>
    </>
  );
};

export default Layout;
