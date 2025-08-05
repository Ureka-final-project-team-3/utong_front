import React from 'react';
import { useNavigate } from 'react-router-dom';

const TradeActionButtons = () => {
  const navigate = useNavigate();

  const goToBuy = () => {
    navigate(`/buydata`);
  };

  const goToSell = () => {
    navigate(`/selldata`);
  };

  return (
    <div className="relative w-full mt-5 flex justify-center gap-5">
      {/* 구매하기 버튼 */}
      <button
        onClick={goToBuy}
        className=" w-1/2 h-[50px] bg-[var(--blue)] rounded-[8px] text-white text-[18px] leading-[23px] font-normal cursor-pointer"
      >
        구매하기
      </button>

      {/* 판매하기 버튼 */}
      <button
        onClick={goToSell}
        className=" w-1/2 h-[50px] bg-[var(--red)] rounded-[8px] text-white text-[18px] leading-[23px] font-normal cursor-pointer"
      >
        판매하기
      </button>
    </div>
  );
};

export default TradeActionButtons;
