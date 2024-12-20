"use client";
import React from "react";
import { Button, Card, Checkbox, Divider, Form, Input, Typography } from "antd";
import request from "@/app/lib/request";
import { BookingPayload } from "@Jetzy/types/hotel-booking";



const bookHotel = async (payload: BookingPayload) => {
  const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v1/meetselect/hotels/book`
  try {
    const result = await request.post(url, payload);

    return result.data;

  } catch (error: any) {
    console.error(error?.message)
  }
}

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
  return (
    <>
      <div className="flex flex-col gap-y-5 w-[40%]">
        <Typography.Text className="text-base font-medium">
          Rooms Selected
        </Typography.Text>
        {/* <RoomDetail
        room={room}
      /> */}

        <Card size="small" className="border-[#C0C0C0]">
          <div className="flex items-center justify-between">
            <Typography.Text className="text-sm text-[#5A5A5A]">
              Single Queen
            </Typography.Text>
            <Typography.Text className="text-sm text-[#5A5A5A]">
              13500 Rs
            </Typography.Text>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Typography.Text className="text-sm text-[#212121] font-semibold">
              Sub Total
            </Typography.Text>
            <Typography.Text className="text-sm text-[#212121] font-semibold">
              13500 Rs
            </Typography.Text>
          </div>
        </Card>
      </div>
    </>
  );
};


const CheckoutForm = () => {
  const [form] = Form.useForm();


  const onFinish = (values: BookingPayload) => {
    const payload = {
      // cvc_code: values.cvc,
      // country_code: values.country,
      // // start_date,
      // // end_date,
      // // card_type,
      // // card_number,
      // // card_holder,
      // // phone_number,
      // // post_code,
      // // address,
      // // city,
      // // expires_year,
      // // expires_month,
      // // email,
      // // name_first,
      // // name_last,
      // // booking_request_id,
      // // external_room_id,
      // // external_hotel_id,

    }
    console.log("Received values of form:", values);
  };

  return (
    <>
      <div className="w-[45%]">
        <Typography.Text className="text-base font-medium mb-5 inline-block">
          Payment Details
        </Typography.Text>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
          name='cardHolderName' 
            label={
              <Typography.Text className="text-lg font-medium">
                Card Holder&apos;s Name
              </Typography.Text>
            }
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter card holder's name"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <Form.Item
          name='cardNumber' 
            label={
              <Typography.Text className="text-lg font-medium">
                Card Number
              </Typography.Text>
            }
          >
            <Input
              size="large"
              variant="filled"
              placeholder="XXXX XXXX XXXX"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <div className="flex gap-x-5 w-full justify-between">
            <Form.Item
            name='cvv' 
              className="w-1/2"
              label={
                <Typography.Text className="text-lg font-medium">
                  CVV
                </Typography.Text>
              }
            >
              <Input
                size="large"
                variant="filled"
                placeholder="Enter CVV Number"
                className="border-[#EDEDED] border"
              />
            </Form.Item>
            <Form.Item
            name='expiryDate' 
              className="w-1/2"
              label={
                <Typography.Text className="text-lg font-medium">
                  Expiry Date
                </Typography.Text>
              }
            >
              <Input
                size="large"
                variant="filled"
                placeholder="DD / MM"
                className="border-[#EDEDED] border"
              />
            </Form.Item>
          </div>
          <Form.Item
          name='phoneNumber' 
            label={
              <Typography.Text className="text-lg font-medium">
                Phone Number
              </Typography.Text>
            }
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter Phone Number"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <Form.Item
          name='address' 
            label={
              <Typography.Text className="text-lg font-medium">
                Address
              </Typography.Text>
            }
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter Card holder's Address"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <Form.Item
          name='city' 
            label={
              <Typography.Text className="text-lg font-medium">
                City
              </Typography.Text>
            }
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter City"
              className="border-[#EDEDED] border"
            />
          </Form.Item>
          <Form.Item
          name='postalCode' 
            label={
              <Typography.Text className="text-lg font-medium">
                Postal Code
              </Typography.Text>
            }
          >
            <Input
              size="large"
              variant="filled"
              placeholder="Enter Postal Code"
              className="border-[#EDEDED] border"
            />
          </Form.Item>

          <div className="flex flex-col gap-y-1">
            <Typography.Text className="text-primary">
              This deal is reserved for Jetzy Select Concierge members. Continue
              to sign up for Jetzy Select Concierge.
            </Typography.Text>
            <Typography.Text className="text-[#7E7E7E]">
              You can cancel any time at{" "}
              <span className="underline text-primary">this link</span>
            </Typography.Text>
            <Typography.Text className="text-[15px] text-[#7E7E7E] my-3">
              Get 70% discounts at 1.6 million hotels globally. Start with a
              30-day free trial and then 100rs/month. No charge today; cancel
              anytime during the one month free trial.
            </Typography.Text>
          </div>
          <Form.Item name='termsAndCondition'>
            <Checkbox checked className="rounded-full text-[#7E7E7E]">
              By getting this deal you accept Jetzy{" "}
              <span className="text-primary underline font-medium">
                terms & condition
              </span>
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" size="large" className="w-full" htmlType="submit">
              Continue
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
