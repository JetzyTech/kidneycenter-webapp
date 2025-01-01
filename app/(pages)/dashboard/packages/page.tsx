"use client";
import { Button, Typography } from "antd";
import React from "react";

enum PackageVariant {
  MONTHLY = "MONTH",
  YEARLY = "YEAR",
}

const packageData = [
  {
    discount: 20,
    pricing: "1,000",
    variant: "year",
    currency: "PKR",
  },
  {
    pricing: "100",
    variant: "month",
    currency: "PKR",
  },
];

const Packages = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-y-10">
        <div className="flex flex-col items-center gap-y-4">
          <Typography.Text className="text-[40px] font-bold text-black">
            Subscribe a Premium Package to Continue
          </Typography.Text>
          <Typography.Text className="text-lg font-normal">
            Subscribe now to any of below packages and get&nbsp;
            <span className="text-primary font-bold">1 month free trial</span>
          </Typography.Text>
        </div>

        <div
          className="absolute bottom-10 left-0 right-0 h-[300px] w-full"
          style={{
            background: `linear-gradient(90deg, #F9A162 0%, #FFF694 100%)`,
            filter: "blur(1000px)",
            opacity: 0.6,
          }}
        />
        <div className="relative mt-20 flex items-center justify-center gap-x-20">
          {packageData.map((data) => (
            <PackageDetails
              key={data.variant}
              discount={data.discount}
              pricing={data.pricing}
              variant={data.variant as PackageVariant}
              currency={data.currency}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Packages;

const PackageDetails = ({
  discount,
  pricing,
  variant,
  currency,
}: {
  discount?: number;
  pricing: string;
  variant: PackageVariant;
  currency: string;
}) => {
  return (
    <>
      <div className="relative w-[368px] h-[346px] border border-[#E1E1E1] rounded-3xl bg-white flex flex-col justify-between items-center p-4 overflow-hidden">
        {discount && (
          <div className="absolute top-[23px] left-[-40px] bg-primary w-[170px] h-[35px] -rotate-45 flex items-center justify-center z-50">
            <Typography.Text className="text-sm font-semibold text-white">
              {discount}%
            </Typography.Text>
          </div>
        )}
        <div className="flex flex-col items-center gap-y-3">
          <Typography.Text className="text-muted font-normal text-[28px] inline-block capitalize">
            {variant}
          </Typography.Text>
          <Typography.Text className="text-black font-bold text-[30px] inline-block">
            {currency}&nbsp;{pricing}
            <span className="text-[20px] text-muted font-normal">
              /{variant}
            </span>
          </Typography.Text>
          <Typography.Text className="text-muted font-normal text-base inline-block">
            Billed&nbsp;
            {variant.toUpperCase() === PackageVariant.MONTHLY
              ? "monthly"
              : "annually"}
          </Typography.Text>
        </div>
        <Typography.Text className="text-black font-normal text-[28px] inline-block">
          Hotels Only
        </Typography.Text>
        {variant.toUpperCase() === PackageVariant.MONTHLY ? (
          <Button
            size="large"
            className="bg-transparent border-primary px-9 font-medium text-primary"
          >
            Get this Package
          </Button>
        ) : (
          <Button
            size="large"
            type="primary"
            className="px-9 font-medium text-[#f9f9f9]"
          >
            Get this Package
          </Button>
        )}
      </div>
    </>
  );
};
