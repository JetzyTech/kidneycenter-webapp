'use client';

import React from 'react';
import { ChevronLeftSVG } from '@/app/assets/icons';
import { useRouter } from 'next/navigation';

export const DetailsBackBtn = () => {
  const router = useRouter();

  const handleBackClick = () => router.back()

  return (
    <div className="flex gap-x-2 cursor-pointer">
      <div className="border border-[#ededed] rounded-lg px-1" onClick={handleBackClick}>
        <ChevronLeftSVG />
      </div>
      <p className="font-semibold text-base">Details</p>
    </div>
  );
};

