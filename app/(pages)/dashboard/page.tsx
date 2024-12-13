"use client";

import {
  ChevronDownSVG,
  MinusSVG,
  Pins,
  PlusSVG,
  SearchSVG,
  Stars,
} from "@/app/assets/icons";
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  MenuProps,
  Select,
  Slider,
  Typography,
  Card,
  Checkbox,
} from "antd";
import Image from "next/image";
import React from "react";

const data = [
  {
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    title: "Luxury Ocean Resort & Spa",
    description:
      "Beachfront resort with private balconies and world-class amenities",
    price: "299",
    currency: "$",
    rating: 4.8,
    discount: "20%",
  },
  {
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    title: "Mountain View Lodge",
    description:
      "Cozy retreat with stunning mountain views and outdoor activities",
    price: "189",
    currency: "$",
    rating: 4.5,
    discount: "15%",
  },
  {
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    title: "City Center Hotel",
    description: "Modern hotel in prime location with business facilities",
    price: "249",
    currency: "$",
    rating: 4.3,
    discount: "10%",
  },
  {
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    title: "Boutique Heritage Hotel",
    description: "Historic building with contemporary comfort and charm",
    price: "279",
    currency: "$",
    rating: 4.7,
    discount: "25%",
  },
  {
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    title: "Riverside Inn & Suites",
    description: "Peaceful riverside location with spacious family rooms",
    price: "159",
    currency: "$",
    rating: 4.2,
    discount: "30%",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div>
        <Typography.Text className="text-[32px] font-semibold">
          Explore Hotels
        </Typography.Text>
      </div>

      <Filters />
      <div className="space-y-5 w-[600px]">
        {data.map((entry) => (
          <div key={entry.title} className="flex border rounded-2xl p-2">
            <div className="relative">
              <Image
                src={entry.img}
                alt={entry.title}
                width={147}
                height={121}
                className="w-[147px] h-[121px] object-cover rounded-xl"
              />
              <div className="bg-primary absolute top-0 left-0 w-max rounded-tl-xl rounded-br-xl px-2">
                <Typography.Text className="text-base font-bold text-white">
                  {entry.discount}
                </Typography.Text>
              </div>
            </div>
            <div className="flex flex-col ml-4 w-full">
              <div className="flex justify-between">
                <Typography.Text className="text-2xl font-bold">
                  {entry.title}
                </Typography.Text>

                <Typography.Text className="text-primary text-lg font-bold">
                  {entry.currency}
                  {entry.price}
                </Typography.Text>
              </div>
              <div className="flex gap-x-1 pt-2 pb-3">
                <Stars />
                <Stars />
                <Stars />
                <Stars />
                <Stars />
              </div>
              <Typography.Text className="text-sm text-muted">
                {entry.description}
              </Typography.Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const Filters = () => {
  const [guests, setGuests] = React.useState(1);
  const [rooms, setRooms] = React.useState(1);
  const [selectedPrice, setSelectedPrice] = React.useState("Any");
  const [priceRange, setPriceRange] = React.useState([0, 1000]);
  const [tempPriceRange, setTempPriceRange] = React.useState([0, 1000]);
  const [selectedStars, setSelectedStars] = React.useState<number[]>([]);

  const where = [
    {
      label: "Select Current Location",
      value: "",
    },
    {
      label: "New York",
      value: "ny",
    },
    {
      label: "Chicago",
      value: "chicago",
    },
    {
      label: "Los Angeles",
      value: "la",
    },
    {
      label: "London",
      value: "london",
    },
  ];

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

  const pricesProps: MenuProps = {
    items: pricesItems,
    onClick: (e) => {
      setSelectedPrice(
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
        onChange={(value) => setTempPriceRange(value as number[])}
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
    <>
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
            <Select
              size="large"
              defaultValue="Select Current Location"
              options={where}
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
            <DatePicker.RangePicker size="large" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label={
              <Typography.Text className="text-base font-medium">
                Guests
              </Typography.Text>
            }
          >
            <Counter count={guests} setCount={setGuests}  />
          </Form.Item>

          <Form.Item
            label={
              <Typography.Text className="text-base font-medium">
                Rooms
              </Typography.Text>
            }
          >
            <Counter count={rooms} setCount={setRooms}  />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              variant="filled"
              size="large"
              icon={<SearchSVG />}
              iconPosition="end"
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
                {selectedPrice}&nbsp;
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

const Counter: React.FC<{ count: number; setCount: React.Dispatch<React.SetStateAction<number>> }> = ({ count, setCount }) => {

  const handleDecrement = () => {
    setCount((prev) => Math.max(1, prev - 1))
  }

  const handleIncrement = () => {
    setCount((prev) => prev + 1)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 w-[131px] h-[40px] rounded-xl bg-[#F9F9F9] border border-[#C0C0C0] px-3">
        <span className="text-sm min-w-[1ch] text-center">{count}</span>
        <div className="flex items-center gap-1">
          <Button
            type="text"
            icon={<MinusSVG width={20} height={20} />}
            onClick={handleDecrement}
            disabled={count <= 1}
          />
          <Button
            type="text"
            icon={<PlusSVG width={20} height={20} />}
            onClick={handleIncrement}
            disabled={count >= 10}
          />
        </div>
      </div>
    </>
  )
}

