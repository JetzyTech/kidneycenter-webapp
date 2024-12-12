"use client";

import { Typography } from "antd";
import { parseAsString, useQueryState } from "nuqs";
import AuthBgImg from "@/app/assets/images/auth/bg-img.png";
import JetzyLogo from "@/app/assets/logos/jetzy-logo.png";
import Image from "next/image";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Link from "next/link";

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

export default function Authentication() {
  const [selectedTab, setSelectedTab] = useQueryState(
    "tab",
    parseAsString.withDefault(AUTH_TABS.LOGIN)
  );

  return (
    <div className="flex justify-between">
      <div className="w-[448px] mx-auto py-10">
        <Link href='/' className="w-max inline-block">
          <Image src={JetzyLogo} alt='Jetzy Logo' className="w-12 h-12 mb-5 cursor-pointer" />
        </Link>
        <div className="flex items-center justify-between gap-x-5 border border-muted w-full rounded-full p-2 mb-10">
          {authItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setSelectedTab(item.key)}
              className={`w-[210px] h-[48px] px-4 py-3 text-center !cursor-pointer ${
                selectedTab === item.key
                  ? "bg-secondary border border-primary rounded-full"
                  : ""
              }`}
            >
              <Typography.Text
                className={`font-medium ${
                  selectedTab === item.key ? "text-primary" : "text-muted"
                }`}
              >
                {item.label}
              </Typography.Text>
            </div>
          ))}
        </div>

        <div className="w-[448px]">
          {authItems.find((item) => item.key === selectedTab)?.children}
        </div>
      </div>
      <div>
        <Image
          src={AuthBgImg}
          alt="Jetzy signup"
          className="w-[896px] h-[900px]"
        />
      </div>
    </div>
  );
}
