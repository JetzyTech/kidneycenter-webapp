'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Typography } from 'antd'

import AppleJetzyApp from '@/app/assets/images/auth/explanation-section/apple-jetzy-app.png'
import GoogleJetzyApp from '@/app/assets/images/auth/explanation-section/google-jetzy-app.png'

import JetzyBadge from '@/app/assets/images/auth/success/badge.png'
import { useSession } from 'next-auth/react'
import { getThreeMonthsLaterDate } from '@Jetzy/app/lib/helper'
import dayjs from 'dayjs'

const Success = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const startDate = new Date().toISOString();
  const threeMonthsAfter = getThreeMonthsLaterDate()

  return (
    <>
    <div className='flex flex-col items-center justify-center gap-y-8'>
      <Image src={JetzyBadge} alt='jetzy pro membership badge' className='w-[267px] h-[267px]' />
      <div className='flex flex-col w-[420px] items-center justify-center text-center'>
      <Typography.Text className='text-[32px] font-bold text-[#222B38]'>Congratulations!</Typography.Text>
      <Typography.Text className='mt-2 mb-5 text-[18px] font-bold text-[#222B38]'>You've Been Awarded a Jetzy Pro Subscription.</Typography.Text>
      <Typography.Text className='text-base font-normal text-[#707C8D]'>Welcome to the premium Jetzy experience, exclusively tailored for you. You&apos;ve been gifted a subscription worth $135 - enjoy unparalleled perks and benefits!</Typography.Text>
      </div>
      <div className='border bg-[#F8F8F8] rounded-xl py-2 px-3 w-[388px] space-y-1'>
        <div className='flex items-center justify-between'>
        <Typography.Text className='text-[20px] font-bold text-black w-40 truncate'>{session?.user?.email}</Typography.Text>
        <Typography.Text className='text-base text-[#07B75F] italic'>Active</Typography.Text>
        </div>
        <div className='flex items-center justify-between'>
        <Typography.Text className='text-base font-normal text-black'>Full Concierge Plan</Typography.Text>
        <Typography.Text className='text-base font-normal text-black'>$135</Typography.Text>
        </div>
        <div className='flex items-center justify-between'>
        <Typography.Text className='text-[15px] text-[#707C8D] font-normal'>Start Date: {dayjs(startDate).format('YYYY-MM-DD')}</Typography.Text>
        <Typography.Text className='text-[15px] text-[#707C8D] font-normal'>End Date: {dayjs(threeMonthsAfter).format('YYYY-MM-DD')}</Typography.Text>
        </div>
      </div>
      <Typography.Text className='text-[#222B38] text-[18px] font-bold'>Login to the app to unlock your VIP perks!</Typography.Text>

      <div className='flex gap-x-2 mb-10 w-[300px]'>
        <a href='/'><Image src={AppleJetzyApp} alt='jetzy mobile app ios'  /></a>
        <a href='/'><Image src={GoogleJetzyApp} alt='jetzy mobile app android'  /></a>
      </div>
    </div>
    </>
  )
}

export default Success