import React from 'react';
import ChartHeader from './components/ChartHeader';
import PriceChart from './components/PriceChart';

const LiveChartPage = () => {
  return (
    <div>
      <ChartHeader />
      <PriceChart />
    </div>
  );
};

export default LiveChartPage;
