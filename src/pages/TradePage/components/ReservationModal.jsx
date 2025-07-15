import React, { useState } from 'react';

const ReservationModal = ({ onConfirm }) => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="w-[284px] bg-[#F6F6F6] rounded-[10.1px] flex flex-col items-center p-5 ">
        {/* 상단 안내 텍스트 */}
        <p className="text-[#2C2C2C] opacity-60 font-medium text-[14px] leading-[17px] text-center mb-3">
          입력한 금액이 현재 최저가보다 낮아 예약 구매로 등록되었어요.
        </p>

        {/* 하단 설명 텍스트 */}
        <p className="text-[#777777] opacity-60 font-normal text-[12px] leading-[15px] text-center mb-3">
          예약은 마이페이지에서 언제든지 취소할 수 있어요.
        </p>

        {/* 확인하기 버튼 */}
        <button
          onClick={() => {
            setVisible(false);
            if (onConfirm) onConfirm();
          }}
          className="w-[90px] h-[35px] bg-gradient-to-t from-[#082366] to-[#082366] rounded-[8px] text-white font-semibold text-[12.17px] leading-[15px]"
        >
          확인하기
        </button>
      </div>
    </div>
  );
};

export default ReservationModal;
