import React from "react";
import { Button as AntdButton } from "antd";
import { AppleIcon, GoogleIcon } from "@/app/assets/icons";
import { ROUTES } from "@Jetzy/configs/routes";
import { signIn } from "next-auth/react";

export default function AuthFooter() {
  const [loader, setLoader] = React.useState(false);

  const handleSSOSignIn = () => {
    // get callback url
    const baseUrl = window.location.origin;
    const callbackUrl = `${baseUrl}${ROUTES.success}`;

    setLoader(true);
    signIn("google", { callbackUrl: callbackUrl })
      .then(() => {
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  };

  return (
    <div className="flex flex-col xl:flex-row items-center gap-y-2 xl:gap-y-0 xl:gap-x-2">
      <AntdButton
        onClick={handleSSOSignIn}
        loading={loader}
        size="large"
        className="rounded-full font-medium px-6 py-6 w-full xl:w-max"
        icon={<GoogleIcon />}
      >
        Sign in with Google
      </AntdButton>
      <AntdButton
        size="large"
        className="rounded-full font-medium px-6 py-6 w-full xl:w-max"
        icon={<AppleIcon />}
      >
        Sign in with Apple
      </AntdButton>
    </div>
  );
}
