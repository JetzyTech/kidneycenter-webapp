"use client";

import React from "react";
import { Drawer } from "vaul";
import { Typography } from "antd";
import { MapSVG } from "@Jetzy/app/assets/icons";
import { Listing } from "./listings";
import { MobileViewFilters } from "../../components/hotels/filters";

export const ListingDrawer = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            <div className="space-y-5 z-50">
              <Drawer.Handle className="mt-5 cursor-grabbing" />

              <Drawer.Title className="font-bold text-[27px] px-5">
                Hotels
              </Drawer.Title>

              <MobileViewFilters />
              <Listing />
            </div>
            <Drawer.Close />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};
