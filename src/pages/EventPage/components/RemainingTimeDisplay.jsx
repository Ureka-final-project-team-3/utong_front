import React, { useEffect, useState } from 'react';

const getRemainingTimeString = (resetHour = 0) => {
  const now = new Date();
  const resetTime = new Date();
  resetTime.setHours(resetHour, 0, 0, 0);

  if (now >= resetTime) {
    resetTime.setDate(resetTime.getDate() + 1); // 다음날로
  }

  const diff = resetTime - now;
  const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
  const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const RemainingTimeDisplay = ({ resetHour = 0 }) => {
  const [timeStr, setTimeStr] = useState(getRemainingTimeString(resetHour));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(getRemainingTimeString(resetHour));
    }, 1000);

    return () => clearInterval(timer);
  }, [resetHour]);

  return (
    <div className="text-center text-[#2769F6] text-[14px] leading-[17px] font-normal mt-2">
      <div className="text-[#2769F6]">초기화까지 남은 시간</div>
      <div className="text-[#777777]">{timeStr}</div>
    </div>
  );
};

export default RemainingTimeDisplay;
