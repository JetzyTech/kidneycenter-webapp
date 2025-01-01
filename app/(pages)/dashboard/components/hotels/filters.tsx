"use client";

import React, { Suspense } from "react";
import PlacesAutocomplete from "./autocomplete";
import { useDashboardContext } from "../../hooks/use-dashboard-context";
import { ChevronDownSVG, SearchSVG, Stars } from "@/app/assets/icons";
import { Counter } from "./counter";
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
import dayjs from "dayjs";

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
  const { infiniteListing } = useDashboardContext();
  const {
    guests,
    rooms,
    priceRange,
    tempPriceRange,
    setTempPriceRange,
    setPriceRange,
    sortPrice,
    selectedStars,
    setSelectedStars,
    updateField,
    checkIn,
    checkOut,
    urlPriceRange,
  } = useFilter();

  const handleSearch = () => {
    infiniteListing.refetch();
  };

  const pricesProps: MenuProps = {
    items: pricesItems,
    onClick: (e) => {
      updateField(
        "sortPrice",
        pricesItems.find((item) => item.key === e.key)?.label || "Any"
      );
    },
  };

  const handleApplyClick = () => {
    if (Array.isArray(tempPriceRange) && tempPriceRange.length === 2) {
      const [minPrice, maxPrice] = tempPriceRange;

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        const formattedValues = `${minPrice.toString()}-${maxPrice.toString()}`;
        updateField("priceRange", formattedValues);
      } else {
        console.error("Invalid price range values");
      }
    } else {
      console.error("Invalid price range");
    }
  };

  const PriceRangeContent = React.useCallback(
    () => (
      <Card className="w-[378px] drop-shadow-xl">
        <Slider
          range
          min={0}
          max={1000}
          defaultValue={tempPriceRange}
          onChange={(value) => {
            setTempPriceRange(value as [number, number]);
          }}
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
              onClick={handleApplyClick}
            >
              Apply
            </Typography.Text>
          </div>
        </div>
      </Card>
    ),
    [tempPriceRange]
  );

  const StarRatingContent = React.useCallback(
    ({
      selectedStars,
      setSelectedStars,
    }: {
      selectedStars: number[];
      setSelectedStars: React.Dispatch<React.SetStateAction<number>>;
    }) => (
      <Card className="w-[176px] drop-shadow-xl">
        <div className="space-y-2 flex flex-col">
          {[1, 2, 3, 4, 5].map((star) => (
            <Checkbox
              key={star}
              checked={selectedStars.includes(star)}
              onChange={() => {
                if (star === selectedStars[0]) {
                  setSelectedStars(0);
                } else {
                  setSelectedStars(star);
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
    ),
    [selectedStars, setSelectedStars]
  );

  const priceRangeArray = urlPriceRange
    ? urlPriceRange.split("-").map(Number)
    : [0, 1000];

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" />
        </div>
      }
    >
      <Form colon={false} className="flex flex-col">
        <div className="flex items-center gap-x-20">
          <Form.Item
            className="w-[350px]"
            label={
              <Typography.Text className="text-base font-medium">
                Where
              </Typography.Text>
            }
          >
            <PlacesAutocomplete />
          </Form.Item>
          <Form.Item
            className="w-[350px]"
            label={
              <Typography.Text className="text-base font-medium">
                When
              </Typography.Text>
            }
          >
            <DatePicker.RangePicker
              size="large"
              format="YYYY-MM-DD"
              className="w-[350px]"
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              value={
                checkIn && checkOut
                  ? [
                      dayjs(checkIn, "YYYY-MM-DD"),
                      dayjs(checkOut, "YYYY-MM-DD"),
                    ]
                  : null
              }
              onChange={(_, dateStrings) => {
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
              disabled={infiniteListing.isFetching || infiniteListing.isPending}
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
                  selectedStars={[selectedStars]}
                  setSelectedStars={(star) => setSelectedStars(star)}
                />
              )}
            >
              <Typography.Text className="inline-flex font-medium">
                {selectedStars > 0
                  ? `${selectedStars} Star${selectedStars > 1 ? "s" : ""}`
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
                {sortPrice.trim() === "" ? "All" : sortPrice}&nbsp;
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
                {priceRangeArray[0] === 0 && priceRangeArray[1] === 1000
                  ? "All"
                  : `$${priceRangeArray[0]} - $${priceRangeArray[1]}`}
                &nbsp;
                <ChevronDownSVG />
              </Typography.Text>
            </Dropdown>
          </Form.Item>
        </div>
      </Form>
    </Suspense>
  );
};
