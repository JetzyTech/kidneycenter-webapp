'use client';

import { ChevronLeftSVG } from '@/app/assets/icons';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export const DetailsBackBtn = () => {
  const router = useRouter(); // Initialize the router

  const handleBackClick = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="flex gap-x-2 cursor-pointer">
      <div className="border border-[#ededed] rounded-lg px-1" onClick={handleBackClick}>
        <ChevronLeftSVG />
      </div>
      <p className="font-semibold text-base">Details</p>
    </div>
  );
};

