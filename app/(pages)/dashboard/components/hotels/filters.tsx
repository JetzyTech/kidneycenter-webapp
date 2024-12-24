"use client";

import React, { Suspense } from "react";
import PlacesAutocomplete from "./autocomplete";
import { useDashboardContext } from "../../hooks/use-dashboard-context";
import { ChevronDownSVG, SearchSVG, Stars } from "@/app/assets/icons";
import { Counter } from "./counter";
import { useSearchParams } from "next/navigation";
import { useFilter } from "../../hooks/use-filter";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Dropdown,
  Form,
  MenuProps,
  Slider,
  Spin,
  Typography,
} from "antd";

const pricesItems = [
  {
    key: "1",
    label: "Low to High",
  },
  {
    key: "2",
    label: "High to Low",
  },
];

export const Filters = () => {
  const searchParams = useSearchParams();

  const { hotelListingMutation } = useDashboardContext();
  const {
    checkIn,
    checkOut,
    guests,
    rooms,
    priceRange,
    tempPriceRange,
    setTempPriceRange,
    setPriceRange,
    setSortPrice,
    sortPrice,
    selectedStars,
    setSelectedStars,
    updateField,
    lat,
    lng,
  } = useFilter();

  React.useEffect(() => {
    const checkIn = searchParams.get("check_in");
    const checkOut = searchParams.get("check_out");
    const guests = searchParams.get("adults");
    const rooms = searchParams.get("rooms");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (checkIn && checkOut && guests && rooms && lat && lng) {
      hotelListingMutation.mutate();
    }
  }, []);

  // infinite scroll
  const handleSearch = () => hotelListingMutation.mutate();

  const pricesProps: MenuProps = {
    items: pricesItems,
    onClick: (e) => {
      setSortPrice(
        pricesItems.find((item) => item.key === e.key)?.label || "Any"
      );
    },
  };

  const PriceRangeContent = () => (
    <Card className="w-[378px] drop-shadow-xl">
      <Slider
        range
        min={0}
        max={1000}
        value={tempPriceRange}
        onChange={(value) => setTempPriceRange(value as [number, number])}
        className="[&_.ant-slider-track]:!bg-primary [&_.ant-slider-handle]:!border-primary"
      />
      <div className="flex justify-end mt-4">
        <div className="flex justify-end gap-x-2">
          <Button
            size="small"
            type="text"
            className="text-muted"
            onClick={() => {
              setTempPriceRange([0, 1000]);
              setPriceRange([0, 1000]);
            }}
          >
            Cancel
          </Button>
          <Typography.Text
            className="text-primary underline hover:text-primary cursor-pointer"
            onClick={() => setPriceRange(tempPriceRange)}
          >
            Apply
          </Typography.Text>
        </div>
      </div>
    </Card>
  );

  const StarRatingContent = ({
    selectedStars,
    setSelectedStars,
  }: {
    selectedStars: number[];
    setSelectedStars: React.Dispatch<React.SetStateAction<number[]>>;
  }) => (
    <Card className="w-[176px] drop-shadow-xl">
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Checkbox
            key={star}
            className="flex"
            checked={selectedStars.includes(star)}
            onChange={() => {
              if (selectedStars.includes(star)) {
                setSelectedStars(selectedStars.filter((s) => s !== star));
              } else {
                setSelectedStars([...selectedStars, star]);
              }
            }}
          >
            <div className="flex gap-x-2">
              {Array.from({ length: star }, (_, i) => (
                <Stars key={i} />
              ))}
            </div>
          </Checkbox>
        ))}
      </div>
    </Card>
  );

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <div>
        <Form colon={false} className="flex flex-col">
          <div className="flex items-center gap-x-10">
            <Form.Item
              className="w-[283px]"
              label={
                <Typography.Text className="text-base font-medium">
                  Where
                </Typography.Text>
              }
            >
              <PlacesAutocomplete />
            </Form.Item>
            <Form.Item
              className="w-[283px]"
              label={
                <Typography.Text className="text-base font-medium">
                  When
                </Typography.Text>
              }
            >
              <DatePicker.RangePicker
                size="large"
                format="YYYY-MM-DD"
                onChange={(dates, dateStrings) => {
                  updateField("checkIn", dateStrings[0]);
                  updateField("checkOut", dateStrings[1]);
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Typography.Text className="text-base font-medium">
                  Guests
                </Typography.Text>
              }
            >
              <Counter
                count={Number(guests)}
                setCount={(value) => updateField("guests", value)}
              />
            </Form.Item>

            <Form.Item
              label={
                <Typography.Text className="text-base font-medium">
                  Rooms
                </Typography.Text>
              }
            >
              <Counter
                count={Number(rooms)}
                setCount={(value) => updateField("rooms", value)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                variant="filled"
                size="large"
                icon={<SearchSVG />}
                iconPosition="end"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Form.Item>
          </div>

          <div className="flex items-center gap-x-10">
            <Form.Item
              label={
                <Typography.Text className="text-muted font-medium">
                  Star ratings
                </Typography.Text>
              }
            >
              <Dropdown
                className="cursor-pointer"
                trigger={["click"]}
                dropdownRender={() => (
                  <StarRatingContent
                    selectedStars={selectedStars}
                    setSelectedStars={setSelectedStars}
                  />
                )}
              >
                <Typography.Text className="inline-flex font-medium">
                  {selectedStars.length > 0
                    ? `${selectedStars.length} Star${
                        selectedStars.length > 1 ? "s" : ""
                      }`
                    : "All"}
                  &nbsp;
                  <ChevronDownSVG />
                </Typography.Text>
              </Dropdown>
            </Form.Item>

            <Form.Item
              label={
                <Typography.Text className="text-muted font-medium">
                  Prices
                </Typography.Text>
              }
            >
              <Dropdown
                menu={pricesProps}
                className="cursor-pointer"
                trigger={["click"]}
              >
                <Typography.Text className="inline-flex font-medium">
                  {sortPrice}&nbsp;
                  <ChevronDownSVG />
                </Typography.Text>
              </Dropdown>
            </Form.Item>

            <Form.Item
              label={
                <Typography.Text className="text-muted font-medium">
                  Price Range
                </Typography.Text>
              }
            >
              <Dropdown
                dropdownRender={() => <PriceRangeContent />}
                className="cursor-pointer"
                trigger={["click"]}
              >
                <Typography.Text className="inline-flex font-medium">
                  {priceRange[0] === 0 && priceRange[1] === 1000
                    ? "All"
                    : `$${priceRange[0]} - $${priceRange[1]}`}
                  &nbsp;
                  <ChevronDownSVG />
                </Typography.Text>
              </Dropdown>
            </Form.Item>
          </div>
        </Form>
      </div>
    </Suspense>
  );
};
