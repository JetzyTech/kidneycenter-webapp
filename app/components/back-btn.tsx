import Link from 'next/link'
import React from 'react'
import { ChevronLeftSVG } from '../assets/icons';

const MobileBackBtn = ({ href}: {href: string}) => {
  return <Link href={href} className="xl:hidden bg-[#C5C5C533] rounded-xl p-3"><ChevronLeftSVG width={30} height={30} /></Link>
}

export default MobileBackBtn