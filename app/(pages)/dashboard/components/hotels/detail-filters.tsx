"use client";

import { DatePicker, Form, Typography, Button, Spin } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import { useFilter } from "../../hooks/use-filter";
import { Counter } from "./counter";
import { Suspense } from "react";

export const Filters = () => {
  const { rooms, guests, updateField } = useFilter();
  const searchParams = useSearchParams();
  const router = useRouter();
  const deal = searchParams.get("deal");
  const id = searchParams.get('id');


  const onProceed = () => router.push(`/dashboard/hotels/${id}/checkout?deal=${deal}`);


  return (
    <Suspense fallback={<Spin/>}>
      <div className="text-end mt-10">
        <Button
          size="large"
          type="primary"
          className="font-medium w-max"
          disabled={!deal}
          onClick={onProceed}
        >
          Proceed to Checkout
        </Button>
      </div>
      <Form colon={false} layout="vertical" className="flex flex-col">
        <div className="flex items-center gap-x-2">
          <Form.Item
            className="w-[200px]"
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
              className="bg-[#F9F9F9] border-[#C0C0C0]"
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
              className="w-[110px]"
              count={Number(rooms)}
              setCount={(value) => updateField("rooms", value)}
              iconHeight={16}
              iconWidth={16}
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
              className="w-[110px]"
              count={Number(guests)}
              setCount={(value) => updateField("guests", value)}
              iconHeight={16}
              iconWidth={16}
            />
          </Form.Item>
        </div>

        <div className="text-end">
          <Button
            type="text"
            variant="text"
            className="w-max text-primary font-bold p-0"
          >
            Apply Filters
          </Button>
        </div>
      </Form>
    </Suspense>
  );
};
