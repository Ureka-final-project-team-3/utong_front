import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PointRechargeModal = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleRecharge = () => {
    navigate('/chargePage');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="w-[284px] h-[147px] bg-[#F6F6F6] rounded-[10px] p-5 flex flex-col items-center shadow-lg">
        {/* 포인트 부족 */}
        <div
          className="text-[#2C2C2C] opacity-60 font-bold text-[20px] leading-[24px] text-center mb-3 font-inter"
          style={{ flexShrink: 0 }}
        >
          포인트 부족
        </div>

        {/* 충전 후 다시 시도해주세요. */}
        <div
          className="text-[#555555] opacity-60 font-medium text-[13px] leading-[16px] text-center mb-6 font-inter"
          style={{ flexShrink: 0 }}
        >
          충전 후 다시 시도해주세요.
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-5">
          <button
            onClick={() => setVisible(false)}
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
