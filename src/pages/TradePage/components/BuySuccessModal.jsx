import React from 'react';

const BuySuccessModal = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="w-[284px] h-[96px] bg-[#F6F6F6] rounded-[10.1188px] flex items-center justify-center">
        <p className="text-[20px] font-bold text-[#2C2C2C] opacity-60">데이터 구매 완료!</p>
      </div>
    </div>
  );
};

export default BuySuccessModal;
