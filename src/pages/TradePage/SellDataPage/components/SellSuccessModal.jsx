import React from 'react';
import { useNavigate } from 'react-router-dom';

const SellSuccessModal = ({ show, onClose }) => {
  const navigate = useNavigate();
  if (!show) return null;

  const handleClose = () => {
    onClose();
    navigate('/chart');
  };

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[284px] bg-[#F6F6F6] rounded-[10px] p-6 shadow-lg flex flex-col items-center text-center gap-2">
        <p className="text-[18px] font-bold text-[#2C2C2C]">데이터 판매 완료!</p>
        <p className="text-[14px] text-[#555]">
          판매 요청한 데이터가
          <br />
          모두 거래되었습니다.
        </p>
        <button
          className="mt-4 w-full text-white font-semibold py-2 rounded-[6px] text-sm bg-[#FF4343] hover:bg-[#e63a3a] cursor-pointer"
          onClick={handleClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SellSuccessModal;
