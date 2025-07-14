import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import utong2 from '../../assets/image/utong2.png';

const StartPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 클리어
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#F6F7FC]">
      <img src={utong2} alt="유통 로고" className="w-[120px] h-auto mb-5" />
      <p className="text-[25px] text-gray-500 font-medium">너로 통하다</p>
    </div>
  );
};

export default StartPage;
