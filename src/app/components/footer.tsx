'use client';

import Image from "next/image";
import { Typography } from "antd";
import JetzyLogo from "../assets/logos/jetzy-logo.png";
import {
  FacebookSVG,
  InstaSVG,
  LinkedInSVG,
  YouTubeSVG,
} from "../assets/icons";

const footerSocial = [
  {
    link: "https://www.facebook.com/jetzyapp/",
    icon: <FacebookSVG />,
  },
  {
    link: "https://www.instagram.com/jetzyapp/?hl=en",
    icon: <InstaSVG />,
  },
  {
    link: "https://www.linkedin.com/company/jetzyapp",
    icon: <LinkedInSVG />,
  },
  {
    link: "https://www.youtube.com/channel/UCNDE8Kmi0_whYcw_2dW_RSQ",
    icon: <YouTubeSVG />,
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
  const currentYear = new Date().getUTCFullYear();
  return (
    <div className="bg-[#FDFDFD]">
      <div className="px-10">
      <div className="flex items-center justify-between py-10">
        <Image src={JetzyLogo} alt="Logo" className="w-12 h-12" />
        <div className="flex items-center gap-x-5">
          {footerSocial.map((socail) => (
            <a key={socail.link} href={socail.link} target='_blank'>{socail.icon}</a>
          ))}
        </div>
      </div>

      <div className="border-t border-t-[#D0D0D0] flex items-center gap-x-8 justify-center py-2">
        <Typography.Text className="text-muted">
          {currentYear} Jetzy. All right reserved.
        </Typography.Text>

        <div className="flex items-center gap-x-5">
          {footerItems.map((item) => (
            <div key={item.label}>
              <Typography.Text className="text-muted">{item.label}</Typography.Text>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
