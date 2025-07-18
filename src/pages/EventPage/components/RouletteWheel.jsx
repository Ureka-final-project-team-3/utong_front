import React, { forwardRef } from 'react';
import rouletteWheel from '@/assets/image/roulette.png';
import arrowImage from '@/assets/image/roulette_arrow.png';

const RouletteWheel = forwardRef(({ rotation }, ref) => {
  return (
    <div className="relative mt-20 select-none pointer-events-none z-30 flex justify-center items-center w-full max-w-[300px] aspect-square mx-auto">
      {/* 화살표 */}
      <img
        src={arrowImage}
        alt="룰렛 화살표"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: '-12px', width: 40, height: 40, zIndex: 50 }}
      />

      {/* 룰렛 */}
      <div
        ref={ref}
        className="w-full h-full flex justify-center items-center"
        style={{
          transform: `rotate(${rotation}deg)`,
          touchAction: 'none',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <img src={rouletteWheel} alt="룰렛 이미지" className="w-full h-full object-contain" />
      </div>
    </div>
  );
});

export default RouletteWheel;
