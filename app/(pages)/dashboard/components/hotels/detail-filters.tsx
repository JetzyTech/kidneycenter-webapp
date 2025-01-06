"use client";

import React, { Suspense } from "react";
import { DatePicker, Form, Typography, Button, Spin, Modal } from "antd";
import { useSearchParams } from "next/navigation";
import { useFilter } from "../../hooks/use-filter";
import { Counter } from "./counter";
import dayjs from "dayjs";
import JetzyPro from "@/app/assets/images/jetzy-pro.png";
import Link from "next/link";
import Image from "next/image";

export const Filters = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const { rooms, guests, updateField, checkIn, checkOut, lat, lng } =
    useFilter();
  const searchParams = useSearchParams();
  const deal = searchParams.get("deal");

  const onProceed = () => {
    // TODO:
    // make an api call to make sure if the user has subscription or not
    setOpenModal(true);
    // router.push(
    //   `/dashboard/hotels/${id}/checkout?check_in=${checkIn}&check_out=${checkOut}&lat=${lat}&lng=${lng}&deal=${deal}`
    // );
  };
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Spin />
        </div>
      }
    >
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 xl:static xl:bottom-auto xl:left-auto xl:transform-none text-end mt-10 z-50">
        <Button
          size="large"
          type="primary"
          className="font-medium w-[380px] xl:w-max"
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
              value={
                checkIn && checkOut
                  ? [
                      dayjs(checkIn, "YYYY-MM-DD"),
                      dayjs(checkOut, "YYYY-MM-DD"),
                    ]
                  : null
              }
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

      <Modal
        centered
        width={652}
        footer={null}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        className="w-[652px] h-[617px] [&_.ant-modal]:!rounded-3xl [&_.ant-modal-content]:!rounded-3xl"
      >
        <div className="flex flex-col gap-y-10 items-center justify-center">
          <Image
            src={JetzyPro}
            alt="jetzy-pro"
            className="w-[237px] h-[177px]"
          />
          <div className="flex flex-col gap-y-5 px-10">
            <Typography.Text className="text-[28px] font-bold leading-[32px]">
              This deal is reserved for Jetzy Select Concierge members
            </Typography.Text>
            <Typography.Text className="text-[#5A5A5A] text-[22px] font-semibold leading-[25px]">
              Jetzy select concierge offers
            </Typography.Text>
            <ul className="flex flex-col items-start justify-start list-disc px-8">
              <li className="text-xl text-[#5a5a5a] font-normal">
                VIP perks & discounts globally
              </li>
              <li className="text-xl text-[#5a5a5a] font-normal">
                Up to <strong className="text-black">70% off</strong> hotels
              </li>
              <li className="text-xl text-[#5a5a5a] font-normal">
                No refund for cancellations after check-in time
              </li>
            </ul>

            <Link
              className="w-full bg-primary text-center font-semibold py-[10px] rounded-lg text-white text-base hover:text-white active:scale-95"
              href="/dashboard/packages"
            >
              Sign Up for Jetzy Select Membership
            </Link>
          </div>
        </div>
      </Modal>
    </Suspense>
  );
};
