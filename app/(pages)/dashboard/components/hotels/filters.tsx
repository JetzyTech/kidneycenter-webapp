"use client";

import React, { Suspense } from "react";
import PlacesAutocomplete from "./autocomplete";
import { useDashboardContext } from "../../hooks/use-dashboard-context";
import {
  CalendarSVG,
  ChevronDownSVG,
  FilterSVG,
  Pins,
  SearchSVG,
  Stars,
} from "@/app/assets/icons";
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
  Modal,
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
        <div className="flex flex-col xl:flex-row xl:items-center gap-x-20">
          <Form.Item
            className="w-[320px]"
            label={
              <Typography.Text className="text-base font-medium">
                Where
              </Typography.Text>
            }
          >
            <PlacesAutocomplete />
          </Form.Item>
          <Form.Item
            className="w-[320px]"
            label={
              <Typography.Text className="text-base font-medium">
                When
              </Typography.Text>
            }
          >
            <DatePicker.RangePicker
              size="large"
              format="YYYY-MM-DD"
              className="w-[300px] bg-[#F9F9F9]"
              popupClassName="dateRangePicker"
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
              className="w-full xl:w-max"
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

export const MobileViewFilters = () => {
  const [openFilters, setOpenFilters] = React.useState(false);
  const { rooms, guests, checkIn, checkOut } = useFilter();
  return (
    <>
      <div
        className="cursor-pointer w-[382px] mx-auto px-10 py-3 border rounded-xl border-[#D7D7D7] space-y-2"
        onClick={() => setOpenFilters(true)}
      >
        <div className="flex items-center justify-between gap-x-5">
          <div className="flex flex-col items-center">
            <Typography.Text>Where</Typography.Text>
            <Typography.Text className="flex items-center gap-x-2">
              <Pins stroke="#000" />
              <span className="font-medium">New York</span>
            </Typography.Text>
          </div>
          <div className="w-[1px] h-12 bg-[#D7D7D7]" />
          <div className="flex flex-col items-center">
            <Typography.Text>When</Typography.Text>
            <Typography.Text className="flex items-center gap-x-2">
              <CalendarSVG />
              &nbsp;
              <span className="font-medium">
                {formatDateToMonthDay(checkIn)}&nbsp;-&nbsp;
                {formatDateToMonthDay(checkOut)}
              </span>
            </Typography.Text>
          </div>
        </div>
        <div className="w-full h-[1px] bg-[#D7D7D7]" />
        <div className="flex items-center justify-between">
          <div className="space-x-3">
            <Typography.Text className="text-[#5A5A5A]">
              Rooms: {rooms}
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A]">
              Guests: {guests}
            </Typography.Text>
          </div>
          <div className="flex items-center gap-x-1">
            <FilterSVG />
            <Typography.Text className="text-primary text-[13px]">
              Edit Filters
            </Typography.Text>
          </div>
        </div>
      </div>

      <Modal
        centered
        open={openFilters}
        footer={null}
        onCancel={() => setOpenFilters(false)}
        style={{ zIndex: 9999999999999 }}
      >
        <div className="flex items-center justify-between mt-10 mb-5">
          <Typography.Text className="text-2xl font-semibold">
            Filters
          </Typography.Text>
          <Typography.Text className="text-lg text-primary">
            Reset
          </Typography.Text>
        </div>
        <div className="w-full py-2">
          <Filters />
        </div>
      </Modal>
    </>
  );
};

const formatDateToMonthDay = (date: string) => dayjs(date).format("MMM DD");
