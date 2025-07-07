// src/pages/EventPage/components/EventHeader.jsx
import React from 'react';
import BackButton from '../../../components/BackButton/BackButton';

// EventHeader.jsx
const EventHeader = () => {
  return (
    <div className="relative">
      <h1 className="text-[40px] font-semibold text-gradient-pink">Rollin 이벤트</h1>
      <div className="mt-[20px] text-[14px] font-bold text-white border border-white rounded-[16px] w-[106px] py-1 text-center">
        이벤트 기간
      </div>
      <div className="mt-[8px] text-[14px] font-bold text-[#2C2C2C] text-center">
        2025.07.02 ~ 2025.07.15
      </div>
    </div>
  );
};

export default EventHeader;
