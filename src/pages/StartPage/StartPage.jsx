import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import utong2 from '../../assets/image/utong2.png';
import bgImage from '../../assets/image/background3.png';

const StartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 w-full h-full flex justify-end items-center">
        <div
          className="
            w-full h-full
            sm:w-[360px] sm:h-[780px]
            bg-background shadow-xl flex flex-col justify-center items-center
            sm:mr-[500px]
          "
        >
          <img src={utong2} alt="유통 로고" className="w-[120px] h-auto mb-5" />
          <p className="text-[25px] text-gray-500 font-medium">너로 통하다</p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
