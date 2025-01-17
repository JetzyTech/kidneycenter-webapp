"use client";

import Image from "next/image";
import Link from "next/link";

import { Typography } from "antd";
import { parseAsString, useQueryState } from "nuqs";

import Signup from "./components/SignUp";
import Login from "./components/Login";
import ExplanationSection from './components/explanation-section';

import AuthBgImg from "@/app/assets/images/auth/bg-image.jpg";
import JetzyLogo from "@/app/assets/logos/jetzy-logo.png";
import FirstExplanation from '@/app/assets/images/auth/explanation-section/first.png'
import SecondExplanation from '@/app/assets/images/auth/explanation-section/second.png'

enum AUTH_TABS {
  SIGNUP = "signup",
  LOGIN = "login",
}

const authItems = [
  {
    key: AUTH_TABS.SIGNUP,
    label: "New Jetzy Member",
    children: <Signup />,
  },
  {
    key: AUTH_TABS.LOGIN,
    label: "Existing Jetzy Member",
    children: <Login />,
  },
];

const explanation = [
  {
    image: FirstExplanation,
    title: `Unlock 3 Months of Jetzy Select Concierge – Exclusively for Kidney Centers Attendees!`,
    description: `Enjoy premium travel perks and explore the world with Jetzy Pro – your key to exclusive hotel deals, dining experiences, and more.`,
    footer: false,
  },
  {
    image: SecondExplanation,
    title: `What is Jetzy?`,
    description: `Jetzy is a global social network of people who enjoy travel and unique lifestyle experiences. Whether it's culture, food, nightlife or outdoors, on our interest and location based Jetzy app you can contact like-minded people for authentic local recommendations or even plan to meet in person so you're never lost or alone anywhere you go.`,
    footer: true,
  },
]

export default function Authentication() {
  const [selectedTab, setSelectedTab] = useQueryState(
    "tab",
    parseAsString.withDefault(AUTH_TABS.SIGNUP)
  );

  return (
    <div className="flex flex-col xl:flex-row justify-between">
      <div className="w-[330px] md:w-[400px] xl:w-[448px] mx-auto py-10">
        <Link href="/" className="w-max inline-block">
          <Image
            src={JetzyLogo}
            alt="Jetzy Logo"
            className="w-12 h-12 mb-5 cursor-pointer"
          />
        </Link>
        <div className="flex items-center justify-between gap-x-5 border border-muted w-full rounded-full p-2 mb-10">
          {authItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setSelectedTab(item.key)}
              className={`w-[160px] xl:w-[210px] h-[48px] px-2 xl:px-4 py-2 text-center !cursor-pointer ${
                selectedTab === item.key
                  ? "bg-secondary border border-primary rounded-full"
                  : ""
              }`}
            >
              <Typography.Text
                className={`font-medium text-xs ${
                  selectedTab === item.key ? "text-primary" : "text-muted"
                }`}
              >
                {item.label}
              </Typography.Text>
            </div>
          ))}
        </div>

        <div className="w-[330px] md:w-[400px] xl:w-[448px]">
          {authItems.find((item) => item.key === selectedTab)?.children}
        </div>
      </div>
      <div className="hidden xl:block relative">
        <Image
          src={AuthBgImg}
          alt="Jetzy signup"
          className="w-[896px] h-screen object-cover"
        />

        <div className="absolute top-1/2 left-0 right-0 flex flex-col items-center text-center w-[564px] mx-auto justify-center">
          <Typography.Text className="font-black text-5xl text-white leading-[60.24px]">
            Live The Jetzy Life!
          </Typography.Text>
          <Typography.Text className="text-[28px] text-white font-normal leading-[35.14px]">
            Connect with like-minded people and have the most unique
            experiences.
          </Typography.Text>
        </div>
      </div>

    <div className="xl:hidden">
      {explanation.map((item) => (
        <ExplanationSection key={item.title} {...item} />
      ))}
    </div>
    </div>
  );
}
