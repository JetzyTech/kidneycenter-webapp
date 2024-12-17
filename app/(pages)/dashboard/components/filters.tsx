import React from "react";
import request from "@/app/lib/request";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useDashboardContext } from "../hooks/use-dashboard-context";
import { Button, Card, Checkbox, DatePicker, Dropdown, Form, MenuProps, message, Select, Slider, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { ChevronDownSVG, Pins, SearchSVG, Stars } from "@/app/assets/icons";
import { usePlacesWidget } from "react-google-autocomplete";
import { Counter } from "./counter";
import { useFilter } from "../hooks/use-filter";

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
  const { setHotelListings } = useDashboardContext();
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
    setPlacesOptions
  } = useFilter();

  // const getGooglePlaces = async () => {
  //   try {
  //     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`;

  //     const result = await axios.get(url);

  //     console.log({result})

  //     if (!result) console.error('No Places Found!');

  //     return result;

  //   } catch (error: any) {
  //     console.error(error.message)
  //     message.error(error.message)
  //   }
  // }

  // infinite scroll
  const getHotelListings = async () => {
    const url = `/v1/meetselect/hotels?rooms=${rooms}&perPage=10&page=1&adults=${guests}&check_in=${checkIn}&check_out=${checkOut}&latitude=37.785834&longitude=-122.406417`;
    try {
      const result = await request.get(url);

      if (!result) message.error("No Hotels Found!");

      return result.data;
    } catch (error: any) {
      console.error(error.message);
      message.error(error.message);
    }
  };

  const hotelListingMutation = useMutation({
    mutationKey: ["hotel-listings"],
    mutationFn: getHotelListings,
    onSettled:(data) => setHotelListings(data),
    onError: (error) => {
      console.error(error.message);
      message.error(error.message);
    },
  });

  const handleSearch = () => hotelListingMutation.mutate();

  const pricesProps: MenuProps = {
    items: pricesItems,
    onClick: (e) => {
      setSortPrice(
        pricesItems.find((item) => item.key === e.key)?.label || 'Any'
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
  )

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
  )

  const { ref } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    onPlaceSelected: (places) => {
      console.log({ places });
      const options =
        places?.map((place: any) => ({
          label: place.description,
          value: place.place_id,
        })) || [];
      setPlacesOptions(options);
    },
  });

  return (
    <>
      <div>
        <Form
          colon={false}
          className="flex flex-col"
        >
          <div className="flex items-center gap-x-10">
            <Form.Item
              className="w-[283px]"
              label={
                <Typography.Text className="text-base font-medium">
                  Where
                </Typography.Text>
              }
            >
              <Select
                showSearch
                ref={ref}
                size="large"
                defaultValue="Select Current Location"
                // options={where}
                suffixIcon={<Pins />}
              />
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
                  updateField('checkIn', dateStrings[0]);
                  updateField('checkOut' , dateStrings[1]);
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
                setCount={(value) => updateField('guests' , value)}
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
                setCount={(value) => updateField('rooms', value)}
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
                dropdownRender={() => (
                  <StarRatingContent
                    selectedStars={selectedStars}
                    setSelectedStars={setSelectedStars}
                  />
                )}
                className="cursor-pointer"
                trigger={["click"]}
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
    </>
  );
};