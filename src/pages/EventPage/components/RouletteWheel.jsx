import React from 'react';
import rouletteWheel from '@/assets/image/roulette.png'; // 실제 룰렛 이미지 경로에 맞게 수정하세요

const RouletteWheel = () => {
  return (
    <div className="relative w-full flex justify-center items-center mt-[80px] select-none pointer-events-none z-30">
  <img
    src={rouletteWheel}
    alt="룰렛 이미지"
    className=""
  />
</div>

  );
};

export default RouletteWheel;
