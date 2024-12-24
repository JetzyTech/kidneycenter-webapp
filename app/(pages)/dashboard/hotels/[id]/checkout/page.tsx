"use client";
import React from "react";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
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
  console.log({ room });

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
  const [form] = Form.useForm();
  const { checkIn, checkOut } = useFilter();

  const user = useAppSelector(getAuthUser);
  console.log({ user });

  const hotelBookingDetail = useAppSelector(
    (state) => state.hotelBooking.detail
  );

  const onCheckoutSubmit = useMutation({
    mutationKey: ["booking::hotel::checkout"],
    mutationFn: bookHotel,
    onSuccess: () => message.success("Your payment has been processed."),
    onError: () => message.error("Something Went Wrong!"),
  });

  console.log({ checkIn, checkOut });

  const onFinish = (values: BookingPayload) => {

    const expiresMonthValue =
      typeof values.expires_month === "string" ? values.expires_month : "";

    console.log({ values: values.expires_month });

    const [expires_month, expires_year] = expiresMonthValue.split("-");

    const payload = {
      cvc_code: values.cvc_code,
      country_code: values.country_code,
      start_date: checkIn,
      end_date: checkOut,
      card_type: 'VI',
      card_number: values.card_number,
      card_holder: values.card_holder,
      phone_number: values.phone_number,
      post_code: values.post_code,
      address: values.address,
      city: values.city,
      expires_year: `${expires_year}`,
      expires_month,
      email: user.email,
      name_first: user.name_first,
      name_last: values.name_last,
      booking_request_id: hotelBookingDetail.booking_request_id as string,
      external_room_id: hotelBookingDetail.external_room_id as string,
      external_hotel_id: hotelBookingDetail.external_hotel_id as string,
    };

    // onCheckoutSubmit.mutate(payload);
    console.log("Received values of form:", payload);
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
              className="border-[#EDEDED] border w-full"
              addonBefore={
              <Select className="w-24">
                {countries.map((country) => (
                <Select.Option key={country.code} value={country.code}>
                 (+{country.code}) {country.name}
                </Select.Option>
                ))}
              </Select>
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
              <>
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
              </>
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
            >
              Continue
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
