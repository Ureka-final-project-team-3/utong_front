import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellReservationModal = ({ onClose }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
    navigate('/chart');
  };
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="w-[284px] bg-[#F6F6F6] rounded-[10.1px] flex flex-col items-center p-5 ">
        {/* 상단 안내 텍스트 */}
        <p className="text-[#FF4343] text-[20px] font-bold leading-[17px] text-center mb-5">
          예약 판매
        </p>
        <p className="text-[#2C2C2C] font-medium text-[14px] leading-[17px] text-center mb-5">
          입력한 금액이 구매 최고가보다 높거나 <br />
          현재 구매 중인 매물이 없습니다.
        </p>
        {/* 하단 설명 텍스트 */}
        <p className="text-[#2C2C2C] opacity-60 font-normal text-[12px] leading-[15px] text-center mb-5">
          마이페이지에서 언제든지 취소할 수 있어요.
        </p>
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="w-full text-white font-semibold py-2 rounded-[6px] text-sm bg-[#FF4343]"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SellReservationModal;
