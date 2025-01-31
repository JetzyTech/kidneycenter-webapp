"use client";

import Image from "next/image";
import { Typography } from "antd";
import JetzyLogo from "../assets/logos/jetzy-logo.png";
import {
  FacebookSVG,
  InstaSVG,
  LinkedInSVG,
  YouTubeSVG,
} from "../assets/icons";

const currentYear = new Date().getUTCFullYear();

const footerSocial = [
  {
    link: "https://www.facebook.com/jetzyapp/",
    icon: <FacebookSVG fill='#8C9094' />,
  },
  {
    link: "https://www.instagram.com/jetzyapp/?hl=en",
    icon: <InstaSVG fill='#8C9094' />,
  },
  {
    link: "https://www.linkedin.com/company/jetzyapp",
    icon: <LinkedInSVG fill='#8C9094' />,
  },
  {
    link: "https://www.youtube.com/channel/UCNDE8Kmi0_whYcw_2dW_RSQ",
    icon: <YouTubeSVG fill='#8C9094' />,
  },
];
const footerItems = [
  {
    link: "/privacy-policy",
    label: "Privacy Policy",
  },
  {
    link: "/tos",
    label: "Terms of Services",
  },
  {
    link: "/cookies",
    label: "Cookies Settings",
  },
];

export default function Footer() {
  return (
    <div className="bg-[#FDFDFD]">
      <div className="px-2 md:px-10">
        <div className="flex items-center justify-between py-10 md:py-20">
          <Image src={JetzyLogo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12" />
          <div className="flex items-center gap-x-5">
            {footerSocial.map((socail) => (
              <a key={socail.link} href={socail.link} target="_blank">
                {socail.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-t-[#D0D0D0] flex flex-col-reverse gap-y-5 md:gap-y-0 md:flex-row items-center md:gap-x-8 md:justify-center py-2">
          <Typography.Text className="text-muted">
            {currentYear} Jetzy. All right reserved.
          </Typography.Text>

          <div className="flex items-center gap-x-2 md:gap-x-5">
            {footerItems.map((item) => (
              <div key={item.label}>
                <Typography.Text className="text-muted">
                  {item.label}
                </Typography.Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const SimpleFooter = () => {
  return (
    <div className="space-x-5 bg-[#FBFBFB] py-3">
      <div className="px-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center space-y-5 md:space-y-0 md:space-x-5">
          <Typography.Text className="text-muted">
            {currentYear} Jetzy. All right reserved.
          </Typography.Text>

          <div className="flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-5">
            {footerItems.map((item) => (
              <div key={item.label}>
                <Typography.Text className="text-muted">
                  {item.label}
                </Typography.Text>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-x-5 mt-5 md:mt-0">
          {footerSocial.map((socail) => (
            <a key={socail.link} href={socail.link} target="_blank">
              {socail.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
