import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCompleteModal = ({ point = 1000, onClose }) => {
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
    navigate('/chart');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="w-[284px] h-[117px] bg-[#F6F6F6] rounded-[8px] flex flex-col justify-between px-2 py-4 shadow-md">
        {/* 상단: 제목 */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-[#2C2C2C] opacity-60 font-bold text-[20px] leading-[24px]">
            분할 구매 완료
          </span>
        </div>

        {/* 중간: 안내 문구 */}
        <p className="text-center text-[#2C2C2C] opacity-80 text-[12px] leading-[15px] font-normal">
          일부 항목만 결제되었으며, 수량이 부족하여 일부 항목은 구매대기로 처리되었습니다.
        </p>

        {/* 하단: 포인트 정보 */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#555555] opacity-60 text-[13px] leading-[16px] font-medium text-center">
            결제 후 보유 포인트 : {point}P
          </span>
          <button
            className="mt-6 w-full text-white font-semibold py-2 rounded-[6px] text-sm bg-[#FF4343]"
            onClick={handleClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompleteModal;
