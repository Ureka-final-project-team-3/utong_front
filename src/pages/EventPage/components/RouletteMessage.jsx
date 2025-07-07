// src/pages/EventPage/components/RouletteMessage.jsx
import React from 'react';

const RouletteMessage = () => {
  return (
    <div className="absolute top-[205px] left-1/2 transform -translate-x-1/2 text-center">
      {/* 룰렛 1번 가능 */}
      <div className="text-[12px] leading-[15px] font-bold bg-gradient-to-l from-[#EB008B] to-[#5B038C] text-transparent bg-clip-text mb-[5px]">
        룰렛 1번 가능
      </div>

      {/* 남은 시간 */}
      <div className="text-[14px] leading-[17px] font-bold text-[#2C2C2C] mb-[10px]">
        27:24:30
      </div>

      {/* 돌림판을 돌려주세요! */}
      <div className="text-[15px] leading-[18px] font-bold bg-gradient-to-r from-[#2769F6] to-[#757AD0] text-transparent bg-clip-text rotate-[-15deg] w-[133px] mx-auto">
        돌림판을 돌려주세요!
      </div>
    </div>
  );
};

export default RouletteMessage;
