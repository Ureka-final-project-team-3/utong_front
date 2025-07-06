// src/pages/EventPage/components/EventHeader.jsx
import React from 'react';

const EventHeader = () => {
  return (
    <div className="absolute top-[55px] left-1/2 transform -translate-x-1/2 text-center">
      <h1 className="text-[40px] leading-[48px] font-semibold bg-gradient-to-l from-[#EB008B] to-[#5B038C] text-transparent bg-clip-text">
        Rollin 이벤트
      </h1>

      <div className="mt-[20px] text-[14px] font-bold text-white border border-white rounded-[16px] w-[106px] mx-auto py-1">
        이벤트 기간
      </div>

      <div className="mt-[8px] text-[14px] font-bold text-[#2C2C2C]">
        2025.07.02 ~ 2025.07.15
      </div>
    </div>
  );
};

export default EventHeader;
