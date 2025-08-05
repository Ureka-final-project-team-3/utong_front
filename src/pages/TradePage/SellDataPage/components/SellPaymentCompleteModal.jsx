import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellPaymentCompleteModal = ({ point = 1000, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/chart');
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[284px] bg-[#F6F6F6] rounded-[10px] p-5 shadow-lg flex flex-col gap-4 text-center">
        {/* 제목 */}
        <p className="text-[#2C2C2C] opacity-60 font-bold text-[18px]">분할 판매 완료</p>

        {/* 안내 문구 */}
        <p className="text-[#2C2C2C] opacity-80 text-[13px] leading-[18px]">
          일부 항목만 판매되었으며
          <br />
          수량이 부족하여 일부 항목은 판매대기로 처리되었습니다.
        </p>

        {/* 포인트 및 버튼 */}
        <p className="text-[#555] text-sm font-medium">판매 후 보유 포인트 : {point}P</p>
        <button
          className="w-full bg-[#FF4343] text-white font-semibold py-2 rounded-md text-sm cursor-pointer"
          onClick={handleClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SellPaymentCompleteModal;
