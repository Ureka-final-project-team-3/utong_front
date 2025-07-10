import React from 'react';
import { useNavigate } from 'react-router-dom';

const TradeActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-[300px] mt-5 flex justify-between">
      {/* 구매하기 버튼 */}
      <button
        onClick={() => navigate('/buydata')}
        className="w-[140px] h-[50px] bg-[var(--blue)] rounded-[8px] text-white text-[18px] leading-[23px] font-normal"
      >
        구매하기
      </button>

      {/* 판매하기 버튼 */}
      <button
        onClick={() => navigate('/selldata')}
        className="w-[140px] h-[50px] bg-[var(--red)] rounded-[8px] text-white text-[18px] leading-[23px] font-normal"
      >
        판매하기
      </button>
    </div>
  );
};

export default TradeActionButtons;
