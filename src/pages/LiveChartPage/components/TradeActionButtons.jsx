// src/pages/LiveChartPage/components/TradeActionButtons.jsx
import React from 'react';

const TradeActionButtons = () => {
  return (
    <div className="relative w-[300px]  mt-5 flex justify-between">
      {/* 구매하기 버튼 */}
      <button className="w-[140px] h-[50px] bg-[var(--blue)] rounded-[8px] text-white text-[18px] leading-[23px] font-normal">
        구매하기
      </button>

      {/* 판매하기 버튼 */}
      <button className="w-[140px] h-[50px] bg-[var(--red)] rounded-[8px] text-white text-[18px] leading-[23px] font-normal">
        판매하기
      </button>
    </div>
  );
};

export default TradeActionButtons;
