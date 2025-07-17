import React, { forwardRef } from 'react';
import rouletteWheel from '@/assets/image/roulette.png';
import arrowImage from '@/assets/image/roulette_arrow.png';

const RouletteWheel = forwardRef(({ rotation }, ref) => {
  return (
    <div
      className="relative mt-[80px] select-none pointer-events-none z-30 flex justify-center items-center"
      style={{ height: 300, width: 300 }}
    >
      {/* 화살표 - 회전 div 밖, 부모에 절대 위치 */}
      <img
        src={arrowImage}
        alt="룰렛 화살표"
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: '-12px', width: 40, height: 40, zIndex: 50 }}
      />

      {/* 회전하는 룰렛 바퀴 */}
      <div
        ref={ref}
        className="flex justify-center items-center"
        style={{
          transform: `rotate(${rotation}deg)`,
          touchAction: 'none',
          overflow: 'hidden',
          width: 300,
          height: 300,
          zIndex: 10,
        }}
      >
        {/* 이미지에 width, height 100% 주기 */}
        <img
          src={rouletteWheel}
          alt="룰렛 이미지"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
});

export default RouletteWheel;
