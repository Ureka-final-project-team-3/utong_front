import React from 'react';
import BackButton from '../../../components/BackButton/BackButton';

import help from '@/assets/icon/help.svg';
import { useNavigate } from 'react-router-dom';

const ChartHeader = () => {
  const navigate = useNavigate();

  const goTotradeguide = () => {
    navigate(`/tradeguide`);
  };

  return (
    <div className="w-full   flex items-center justify-between">
      <BackButton />
      <h1 className="text-[length:var(--text-lg)] text-[color:var(--gray-800)] font-bold">
        데이터 거래하기
      </h1>
      <img
        src={help}
        alt="TradeGuide"
        draggable={false}
        onClick={goTotradeguide}
        className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 active:scale-90"
      />
    </div>
  );
};

export default ChartHeader;
