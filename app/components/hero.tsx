"use client";

import { Button, Typography } from "antd";
import Image from "next/image";
import HblLogo from "../assets/logos/hbl-logo.png";
import { ArrowRight } from "../assets/icons";

export default function Hero() {
  return (
    <>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center mt-14">
        <Typography.Text className="text-[42px] font-extrabold leading-[64px] text-center">
          <div className="flex items-center justify-center flex-wrap">
            Exclusive Discounts up-to 75%
            <span className="inline-flex items-center mx-2 h-12">
             Hotels for&nbsp;
              <Image
                src={HblLogo}
                alt="logo"
                width={80}
                height={48}
                className="object-contain"
              />
            </span>
            Users!
          </div>
        </Typography.Text>
        <Typography.Text className="text-paragraph font-normal text-[22px] leading-[32px] inline-block mt-5 mb-7">
          Discover exclusive savings and rewards tailored just for you as a
          valued customer of HBL Bank Ltd.! Enjoy special offers, personalized
          discounts, and unique benefits.
        </Typography.Text>

        <button
          className="rounded-full bg-[#00B1B2] text-white w-[200px] h-[60px] text-base font-medium flex items-center justify-center gap-x-2 active:scale-95 transition\
       duration-200 hover:bg-[#00b2b2e3]"
        >
          Get Started Now! <ArrowRight />
        </button>
      </div>
    </>
  );
}
