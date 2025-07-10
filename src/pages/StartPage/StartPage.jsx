import React from 'react';
import utong2 from '../../assets/image/utong2.png';

const StartPage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#F6F7FC]">
      <img src={utong2} alt="유통 로고" className="w-[120px] h-auto mb-5" />
      <p className="text-[25px] text-gray-500 font-medium">너로 통하다</p>
    </div>
  );
};

export default StartPage;
