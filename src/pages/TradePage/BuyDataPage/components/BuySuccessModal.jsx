import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuySuccessModal = ({ show, onClose }) => {
  const navigate = useNavigate();
  if (!show) return null;

  const handleClose = () => {
    onClose();
    navigate('/chart');
  };
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="w-[284px] h-[96px] bg-[#F6F6F6] rounded-[10.1188px] flex items-center justify-center">
        <p className="text-[20px] font-bold text-[#2C2C2C] opacity-60">데이터 구매 완료!</p>
        <p className="text-[16px] text-gray-600 opacity-80 mt-1">
          구매 요청한 데이터가 모두 거래되었습니다.
        </p>
        <button
          className="mt-6 w-full text-white font-semibold py-2 rounded-[6px] text-sm bg-[#386DEE]"
          onClick={handleClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default BuySuccessModal;
