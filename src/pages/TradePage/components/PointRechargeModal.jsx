import React from 'react';
import { useNavigate } from 'react-router-dom';

const PointRechargeModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleRecharge = () => {
    navigate('/chargePage');
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="w-[284px] h-[147px] bg-[#F6F6F6] rounded-[10px] p-5 flex flex-col items-center shadow-lg">
        <div
          className="text-[#2C2C2C] opacity-60 font-bold text-[20px] leading-[24px] text-center mb-3 font-inter"
          style={{ flexShrink: 0 }}
        >
          포인트 부족
        </div>

        <div
          className="text-[#555555] opacity-60 font-medium text-[13px] leading-[16px] text-center mb-6 font-inter"
          style={{ flexShrink: 0 }}
        >
          충전 후 다시 시도해주세요.
        </div>

        <div className="flex gap-5">
          <button
            onClick={onClose}
            className="w-[90px] h-[35px] bg-[#2769F6] rounded-[8px] text-white font-semibold text-[12px] leading-[15px] font-inter"
          >
            닫기
          </button>

          <button
            onClick={handleRecharge}
            className="w-[90px] h-[35px] bg-gradient-to-t from-[#082366] to-[#082366] rounded-[8px] text-white font-semibold text-[12px] leading-[15px] font-inter"
          >
            충전하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointRechargeModal;
