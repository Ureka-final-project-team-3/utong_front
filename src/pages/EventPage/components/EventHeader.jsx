import React, { useState } from 'react'
import BackButton from '../../../components/BackButton/BackButton'
import help from '@/assets/icon/help.svg';

const EventHeader = () => {
  return ( 
    <div className="w-full   flex items-center justify-between">
      <BackButton />
      <h1 className="text-[length:var(--text-lg)] text-[color:var(--gray-800)] font-bold">
        룰렛 이벤트
      </h1>
      <div className='w-[20px]'></div>
    </div>
  )
}

export default EventHeader;