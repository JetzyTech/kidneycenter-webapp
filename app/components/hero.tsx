"use client";

import React from "react";
import { Typography } from "antd";
import { ArrowRight } from "../assets/icons";
import Image, { StaticImageData } from "next/image";

import HblLogo from "../assets/logos/hbl-logo.png";
import BgBlob from "../assets/images/bg-blob.png";

import Image1 from '../assets/images/hero/bed.png';
import Image2 from '../assets/images/hero/buildings.png';
import Image3 from '../assets/images/hero/large-room.png';
import Image4 from '../assets/images/hero/room.png';
import Image5 from '../assets/images/hero/table.png';
import Link from "next/link";

const images = [Image1, Image2, Image3, Image4, Image5];

export default function Hero() {
  return (
    <>
    <div className="relative">
      <div className="absolute -top-[3.5rem] left-0 right-0 pointer-events-none">
        <Image src={BgBlob} alt="bg-blob" className="w-[1110px] h-[560px] mx-auto" />
      </div>
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

        <Link href='/dashboard/hotels' className="rounded-full bg-[#00B1B2] text-white w-[200px] h-[60px] text-base font-medium flex items-center justify-center gap-x-2 active:scale-95 transition duration-200 hover:bg-[#00b2b2e3]">
          Get Started Now! <ArrowRight />
        </Link>
      </div>
    </div>

    <ImageCarousal images={images} />
    </>
  );
}


const ImageCarousal = ({images}: {images: StaticImageData[]}) => {
  return (
    <div className=" w-full mt-20">
      <div className="flex items-center justify-center gap-x-5">
        {images.map((entry, index) => (
          <div
            key={index}
            className={`transition-all duration-300 cursor-pointer ${
              index === 2 
                ? 'w-[600px] h-[400px] px-4' 
                : 'w-[400px] h-[300px]'
            }`}
          >
            <Image 
              src={entry} 
              alt={`carousel-image-${index}`} 
              className={`object-cover transition-all duration-300 ${
                index === 2 
                  ? 'scale-110' 
                  : 'opacity-70'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}