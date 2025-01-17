import React from 'react'
import {Typography} from 'antd'
import Image, { StaticImageData } from 'next/image'
import AppleJetzyApp from '@/app/assets/images/auth/explanation-section/apple-jetzy-app.png'
import GoogleJetzyApp from '@/app/assets/images/auth/explanation-section/google-jetzy-app.png'


const ExplanationSection = ({title, description, image, footer = false}: {title: string; description: string; image: StaticImageData, footer?: boolean}) => {
  return (
    <>
    <div className='flex flex-col'>
      <Image src={image} alt={title} width={480} height={320} className='w-full h-[320px] object-cover' />
    <div className='py-6 px-3 w-[300px] md:w-[400px] lg:w-[500px] mx-auto space-y-4'>
      <Typography.Text className='text-3xl font-extrabold text-[#2E3134] block'>{title}</Typography.Text>
      <Typography.Text className='block text-lg text-[#595E62]'>{description}</Typography.Text>

      {footer &&
        <div className='flex gap-x-2 mb-10 w-[300px]'>
        <a href='/'><Image src={AppleJetzyApp} alt='jetzy mobile app ios' /></a>
        <a href='/'><Image src={GoogleJetzyApp} alt='jetzy mobile app android' /></a>
      </div>
      }
    </div>
      
      
    </div>
    </>
  )
}

export default ExplanationSection