"use client";

import React, { Suspense } from "react";
import PlacesAutocomplete from "../../components/hotels/autocomplete";
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
    className: "w-28",
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
      <Card className="w-[300px] sm:w-[378px] drop-shadow-xl">
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

  React.useEffect(() => {
    if (!checkIn && !checkOut) {
      const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
      const dayAfterTomorrow = dayjs().add(2, "day").format("YYYY-MM-DD");

      updateField("checkIn", tomorrow);
      updateField("checkOut", dayAfterTomorrow);
    }
  }, []);

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
            className="w-[320px] z-50"
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
              className="w-[330px] xl:w-[300px] bg-[#F9F9F9]"
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
                  : [dayjs().add(1, "day"), dayjs().add(2, "day")]
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
              size="large"
              type="primary"
              variant="filled"
              iconPosition="end"
              className="w-full xl:w-max"
              icon={<SearchSVG />}
              onClick={handleSearch}
              disabled={infiniteListing.isFetching || infiniteListing.isPending}
            >
              Search
            </Button>
          </Form.Item>
        </div>

        <div className="flex items-center xl:gap-x-10 gap-x-5">
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
              getPopupContainer={(triggerNode) => triggerNode.parentElement!}
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
              getPopupContainer={(triggerNode) => triggerNode.parentElement!}
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
              getPopupContainer={(triggerNode) => triggerNode.parentElement!}
              className="cursor-pointer"
              trigger={["click"]}
              placement="bottom"
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
