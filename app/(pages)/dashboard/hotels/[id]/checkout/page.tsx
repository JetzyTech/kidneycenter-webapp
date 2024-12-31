"use client";
import React from "react";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  MenuProps,
  message,
  Modal,
  Typography,
} from "antd";
import request from "@/app/lib/request";
import { BookingPayload } from "@Jetzy/types/hotel-booking";
import { getAuthUser, useAppSelector } from "@Jetzy/redux";
import { useMutation } from "@tanstack/react-query";
import { RoomDetail } from "../../../components/hotels/room-details";
import { Room } from "@Jetzy/types/hotel-booking";
import { useFilter } from "../../../hooks/use-filter";
import { countries } from "@Jetzy/app/lib/countries";
import { ChevronDownSVG, GreenCheckmarkSVG } from "@Jetzy/app/assets/icons";
import dayjs from "dayjs";
import Link from "next/link";

const bookHotel = async (payload: BookingPayload) => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/meetselect/hotels/book`;
  try {
    const result = await request.post(url, payload);

    return result.data;
  } catch (error: any) {
    console.error(error?.message);
  }
};

const Checkout = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Typography.Text className="text-[28px] font-bold">
        Checkout
      </Typography.Text>

      <div className="flex items-start justify-between w-full mt-8">
        <RoomsInfo />
        <Divider type="vertical" className="h-[937px] bg-[#DADADA]" />
        <CheckoutForm />
      </div>
    </div>
  );
};

export default Checkout;

const RoomsInfo = () => {
  const room: Room = useAppSelector((state) => state.hotelBooking.room);

  return (
    <>
      <div className="flex flex-col gap-y-5 w-[444px]">
        <Typography.Text className="text-base font-medium">
          Rooms Selected
        </Typography.Text>

        <RoomDetail footer={false} room={room} />

        <Card size="small" className="border-[#C0C0C0]">
          <div className="flex items-center justify-between">
            <Typography.Text className="text-sm text-[#5A5A5A]">
              {room?.title}
            </Typography.Text>
            <Typography.Text className="text-sm text-[#5A5A5A]">
              {room?.rate_data?.price_details?.display_symbol}{" "}
              {room?.rate_data?.price_details?.source_sub_total}
            </Typography.Text>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Typography.Text className="text-sm text-[#212121] font-semibold">
              Sub Total
            </Typography.Text>
            <Typography.Text className="text-sm text-[#212121] font-semibold">
              {room?.rate_data?.price_details?.display_symbol}{" "}
              {room?.rate_data?.price_details?.display_all_in_total}
            </Typography.Text>
          </div>
        </Card>
      </div>
    </>
  );
};

const CheckoutForm = () => {
  const [selectedCountryCode, setSelectedCountryCode] =
    React.useState<number>(0);
  const [form] = Form.useForm();
  const { checkIn, checkOut } = useFilter();

  const user = useAppSelector(getAuthUser);

  const hotelBookingDetail = useAppSelector(
    (state) => state.hotelBooking.detail
  );

  const onCheckoutSubmit = useMutation({
    mutationKey: ["booking::hotel::checkout"],
    mutationFn: bookHotel,
    onSuccess: () => {
      Modal.success({
        centered: true,
        className: "w-[464px] h-[430px] rounded-[24px]",
        destroyOnClose: true,
        icon: null,
        onCancel: () => false,
        title: (
          <div className="flex flex-col gap-y-10 items-center justify-center text-center">
            <GreenCheckmarkSVG />
            <Typography.Text className="text-[#5A5A5A] text-[26px] font-medium leading-[36px]">
              Your payment has been processed
            </Typography.Text>

            <Link
              className="w-full bg-primary font-semibold py-[10px] rounded-lg text-white text-lg hover:text-white active:scale-95"
              href="/dashboard/hotels"
            >
              View Booking
            </Link>
          </div>
        ),
        footer: null,
      });
    },
    onError: () => message.error("Something Went Wrong!"),
  });

  const onFinish = (values: BookingPayload) => {
    const formatExpiresAt = values.expires_month
      ? dayjs(values.expires_month).format("MM/YY")
      : null;

    const expires_month = formatExpiresAt?.split("/")[0] as string;
    const expires_year = formatExpiresAt?.split("/")[1] as string;

    const payload = {
      cvc_code: values.cvc_code,
      country_code: `+${selectedCountryCode.toString()}`,
      start_date: checkIn,
      end_date: checkOut,
      card_type: "VI",
      card_number: values.card_number,
      card_holder: values.card_holder,
      phone_number: values.phone_number,
      post_code: values.post_code,
      address: values.address,
      city: values.city,
      expires_year,
      expires_month,
      email: user.email,
      name_first: user.firstName,
      name_last: user.lastName,
      booking_request_id: hotelBookingDetail.booking_request_id as string,
      external_room_id: hotelBookingDetail.external_room_id as string,
      external_hotel_id: hotelBookingDetail.external_hotel_id as string,
    };

    onCheckoutSubmit.mutate(payload);
  };

  const countryCode: MenuProps = {
    items: countries.map((country) => ({
      key: country.code,
      label: (
        <div className="flex items-center gap-x-2">
          <Typography.Text className="inline-block w-16 text-xs">{`(+${country.code})`}</Typography.Text>
          <Typography.Text className="inline-block w-5 text-xs">{`${country.flag}`}</Typography.Text>
          <Typography.Text className="font-medium text-xs">{`${country.name}`}</Typography.Text>
        </div>
      ),
    })),
    className: "h-96",

    onClick: (e) => {
      setSelectedCountryCode(Number(e.key));
    },
  };

  return (
    <>
      <div className="w-[45%]">
        <Typography.Text className="text-base font-medium mb-5 inline-block">
          Payment Details
        </Typography.Text>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="card_holder"
            label={
              <Typography.Text className="text-lg font-medium">
                Card Holder&apos;s Name
              </Typography.Text>
            }
            rules={[
              { required: true, message: "Card Holder&apos; name is Required" },
            ]}
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter card holder's name"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <Form.Item
            name="card_number"
            label={
              <Typography.Text className="text-lg font-medium">
                Card Number
              </Typography.Text>
            }
            rules={[
              {
                required: true,
                message: "Card Number is Required",
              },
            ]}
          >
            <InputNumber
              size="large"
              variant="filled"
              placeholder="XXXX XXXX XXXX"
              className="border-[#EDEDED] border w-full"
            />
          </Form.Item>
          <div className="flex gap-x-5 w-full justify-between">
            <Form.Item
              name="cvc_code"
              className="w-1/2"
              label={
                <Typography.Text className="text-lg font-medium">
                  CVV
                </Typography.Text>
              }
              rules={[
                {
                  required: true,
                  message: "CVV is Required",
                  len: 3,
                  validator: (_, value) =>
                    value && value.toString().length === 3
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("CVV must be exactly 3 digits")
                        ),
                },
              ]}
            >
              <InputNumber
                size="large"
                variant="filled"
                placeholder="Enter CVV Number"
                className="border-[#EDEDED] border w-full"
                maxLength={3}
              />
            </Form.Item>
            <Form.Item
              name="expires_month"
              className="w-1/2"
              label={
                <Typography.Text className="text-lg font-medium">
                  Expiry Date
                </Typography.Text>
              }
              rules={[{ required: true, message: "Expiry Date is Required" }]}
            >
              <DatePicker
                size="large"
                picker="month"
                format="MM/YY"
                placeholder="MM / YY"
                value={
                  checkIn && checkOut
                    ? [
                        dayjs(checkIn, "YYYY-MM-DD"),
                        dayjs(checkOut, "YYYY-MM-DD"),
                      ]
                    : null
                }
                className="border border-[#EDEDED] w-full"
              />
            </Form.Item>
          </div>
          <Form.Item
            name="phone_number"
            label={
              <Typography.Text className="text-lg font-medium">
                Phone Number
              </Typography.Text>
            }
            rules={[{ required: true, message: "Phone Number is Required" }]}
          >
            <InputNumber
              size="large"
              variant="filled"
              placeholder="Enter Phone Number"
              className="w-full"
              addonBefore={
                <Dropdown menu={countryCode} trigger={["click"]}>
                  <Typography.Text className="inline-flex items-center gap-x-1 w-12 cursor-pointer">
                    {`+(${selectedCountryCode})`}
                    <ChevronDownSVG height={16} width={16} />
                  </Typography.Text>
                </Dropdown>
              }
            />
          </Form.Item>
          <Form.Item
            name="address"
            label={
              <Typography.Text className="text-lg font-medium">
                Address
              </Typography.Text>
            }
            rules={[{ required: true, message: "Address is Required" }]}
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter Card holder's Address"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <Form.Item
            name="city"
            label={
              <Typography.Text className="text-lg font-medium">
                City
              </Typography.Text>
            }
            rules={[{ required: true, message: "City is Required" }]}
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter City"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <Form.Item
            name="post_code"
            label={
              <Typography.Text className="text-lg font-medium">
                Postal Code
              </Typography.Text>
            }
            rules={[{ required: true, message: "Post Code is Required" }]}
          >
            <InputNumber
              size="large"
              variant="filled"
              placeholder="Enter Postal Code"
              className="border-[#EDEDED] border w-full"
            />
          </Form.Item>

          <div className="flex flex-col gap-y-1">
            <Typography.Text className="text-primary">
              This deal is reserved for Jetzy Select Concierge members. Continue
              to sign up for Jetzy Select Concierge.
            </Typography.Text>

            <Form.Item name="jetzy_pro">
              <div>
                <Checkbox
                  defaultChecked
                  className="rounded-full text-[15px] text-[#7E7E7E] my-3 "
                >
                  By getting this deal you become a member of Jetzy Select
                  Concierge. With this membership you get upto 70% discounts at
                  1.6 million hotels globally. Start with a 30-day free trial
                  and then 100rs/month. No charge today; cancel anytime during
                  the one month free trial.
                </Checkbox>
                <Typography.Text className="text-[#7E7E7E] pl-6">
                  You can cancel any time at&nbsp;
                  <span className="underline text-primary">this link</span>
                </Typography.Text>
              </div>
            </Form.Item>
          </div>

          <Form.Item name="termsAndCondition">
            <Checkbox defaultChecked className="rounded-full text-[#7E7E7E]">
              By getting this deal you accept Jetzy{" "}
              <span className="text-primary underline font-medium">
                terms & condition
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              className="w-full"
              htmlType="submit"
              loading={onCheckoutSubmit.isPending}
              disabled={
                onCheckoutSubmit.isPending || onCheckoutSubmit.isSuccess
              }
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
