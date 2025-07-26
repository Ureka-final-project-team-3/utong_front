// 📁 src/pages/LiveChartPage/components/ChartHeader.jsx
import React from 'react';
import BackButton from '../../../components/BackButton/BackButton';

import tradeGuide from '@/assets/icon/tradeguide.svg';

const ChartHeader = () => {
  return (
    <div className="w-full   flex items-center justify-between">
      <BackButton />

      <h1 className="text-[length:var(--text-lg)] text-[color:var(--gray-800)] font-bold">
        데이터 거래하기
      </h1>

      <img src={tradeGuide} alt="TradeGuide" draggable={false} />
    </div>
  );
};

export default ChartHeader;
