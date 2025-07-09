// src/pages/LiveChartPage/components/TradeInfoSection.jsx
import React from 'react';

const TradeInfoSection = () => {
  return (
    <div className="relative w-[300px] h-[180px] mt-4">
      {/* 상단 구분선 */}
      <div className="absolute top-0 w-full h-[2px] bg-[#D9D9D9]" />
      <div className="absolute top-[36px] w-full h-[2px] bg-[#D9D9D9]" />

      {/* 라벨 텍스트 */}
      <div className="absolute top-[12px] left-[37px] text-[14px] text-[#2C2C2C]">체결거래</div>
      <div className="absolute top-[12px] left-[130px] text-[14px] text-[#EB008B]">판매입찰</div>
      <div className="absolute top-[12px] left-[230px] text-[14px] text-[#2C2C2C]">구매입찰</div>

      {/* 거래가/데이터 텍스트 */}
      <div className="absolute top-[50px] left-[90px] text-[12px] text-[#2C2C2C]">거래가</div>
      <div className="absolute top-[50px] left-[225px] text-[12px] text-[#2C2C2C]">데이터</div>

      {/* 체결 거래 정보 */}
      <div className="absolute top-[78px] left-[90px] text-[12px] text-[#777]">8,600P</div>
      <div className="absolute top-[103px] left-[90px] text-[12px] text-[#777]">8,500P</div>
      <div className="absolute top-[128px] left-[90px] text-[12px] text-[#777]">8,400P</div>
      <div className="absolute top-[153px] left-[90px] text-[12px] text-[#777]">8,300P</div>

      {/* 데이터 양 */}
      <div className="absolute top-[78px] left-[225px] text-[12px] text-[#777]">20GB</div>
      <div className="absolute top-[103px] left-[233px] text-[12px] text-[#777]">1GB</div>
      <div className="absolute top-[128px] left-[230px] text-[12px] text-[#777]">4GB</div>
      <div className="absolute top-[153px] left-[227px] text-[12px] text-[#777]">40GB</div>

      {/* 막대 (입찰량 시각화) */}
      <div className="absolute top-[78px] left-[265px] w-[20px] h-[15px] bg-[#FF4343]" />
      <div className="absolute top-[103px] left-[265px] w-[1px] h-[15px] bg-[#D9D9D9]" />
      <div className="absolute top-[128px] left-[265px] w-[6px] h-[15px] bg-[#FF4343]" />
      <div className="absolute top-[153px] left-[265px] w-[40px] h-[15px] bg-[#FF4343]" />
    </div>
  );
};

export default TradeInfoSection;
