import React, { forwardRef } from 'react';
import rouletteWheel from '@/assets/image/roulette.png'; // 실제 이미지 경로에 맞게 수정하세요

const RouletteWheel = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full flex justify-center items-center mt-[80px] select-none pointer-events-none z-30"
      style={{ touchAction: 'none' }} // 모바일 터치 동작 방지용, 필요하면 제거하세요
    >
      <img src={rouletteWheel} alt="룰렛 이미지" />
    </div>
  );
});

export default RouletteWheel;
