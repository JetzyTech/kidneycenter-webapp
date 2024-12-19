import { Button } from "antd";
import Image from "next/image";
import JetzyLogo from '../assets/logos/jetzy-logo.png';

export default function Navbar() {
  return (
    <div className="flex items-center justify-between py-4 px-10 border-b border-b-[#EDEDED]">
      <div>
        <Image src={JetzyLogo} alt='Jetzy Logo' className="w-12 h-12"/>
      </div>
      <div>
        <Button className="rounded-full border-primary text-primary font-semibold">Log in / Signup</Button>
      </div>
    </div>
  )
}