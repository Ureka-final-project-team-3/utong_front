// src/pages/LiveChartPage/components/PriceChartInfo.jsx
import React from 'react';

const PriceChartInfo = () => {
  return (
    <div className="relative w-full max-w-[300px] mt-[30px] px-4 mb-[10px]">
      <div className="mb-2">
        <div className="text-[20px] leading-[24px] text-[#2C2C2C]">최근 거래가</div>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-[30px] leading-[36px] font-bold text-[#EB008B]">8,700</span>
          <span className="text-[12px] leading-[15px] text-[#2C2C2C]">원 (1GB)</span>
        </div>
      </div>

      <div className="absolute right-2 top-2 flex flex-col gap-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-[13px] h-[13px] rounded-full bg-[#5732A1]" />
          <span className="text-[14px] font-bold text-[#6A6666]">5G</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[13px] h-[13px] rounded-full bg-[#D9D9D9]" />
          <span className="text-[14px] font-bold text-[#6A6666]">LTE</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center items-center gap-4">
        <span className="text-[14px] text-[#2C2C2C]">오늘 시세</span>
        <div className="w-[2px] h-[20px] bg-[#D9D9D9]" /> {/* Divider */}
        <span className="text-[14px] text-[#EB008B]">전체 시세</span>
      </div>
    </div>
  );
};

export default PriceChartInfo;
