import React, { forwardRef } from 'react';
import rouletteWheel from '@/assets/image/roulette.png';

const RouletteWheel = forwardRef(({ rotation, isSpinning }, ref) => {
  return (
    <div
      ref={ref}
      className="relative flex justify-center items-center mt-[80px] select-none pointer-events-none z-30"
      style={{
        transition: 'transform 5s ease-out',
        transform: `rotate(${rotation}deg)`,
        touchAction: 'none',
        overflow: 'hidden',
      }}
    >
      <img src={rouletteWheel} alt="룰렛 이미지" />
    </div>
  );
});

export default RouletteWheel;
