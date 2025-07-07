// src/pages/EventPage/components/RouletteWheel.jsx
import React from 'react';
import rouletteImg from '../../../assets/roulette.svg'; // 경로에 맞게 수정
// 필요 시 여러 텍스트 위치를 배열로 관리할 수도 있어요

const RouletteWheel = () => {
  return (
    <div className="relative w-full h-full">
      {/* 룰렛 이미지 */}
      <img
        src={rouletteImg}
        alt="룰렛"
        className="absolute top-[302px] left-[18px] w-[325px] h-[325px]"
      />

      {/* 텍스트들 */}
      <span className="absolute top-[378px] left-[192px] text-white font-medium text-[20px] leading-[24px]">당첨!</span>
      <span className="absolute top-[432px] left-[242px] text-white font-medium text-[20px] leading-[24px]">꽝!</span>
      <span className="absolute top-[494px] left-[248px] text-white font-medium text-[20px] leading-[24px]">꽝!</span>
      <span className="absolute top-[543px] left-[203px] text-white font-medium text-[20px] leading-[24px]">꽝!</span>
      <span className="absolute top-[543px] left-[136px] text-white font-medium text-[20px] leading-[24px]">꽝!</span>
      <span className="absolute top-[494px] left-[90px] text-white font-medium text-[20px] leading-[24px]">꽝!</span>
      <span className="absolute top-[427px] left-[90px] text-white font-medium text-[20px] leading-[24px]">꽝!</span>
      <span className="absolute top-[378px] left-[137px] text-white font-medium text-[20px] leading-[24px]">꽝!</span>
    </div>
  );
};

export default RouletteWheel;
