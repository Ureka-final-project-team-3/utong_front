import React, { useState } from 'react';
import ChartHeader from './components/ChartHeader';
import PriceChart from './components/PriceChart';
import PriceChartInfo from './components/PriceChartInfo';
import TradeInfoSection from './components/TradeInfoSection';
import TradeActionButtons from './components/TradeActionButtons';

const LiveChartPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState('5G'); // '5G' or 'LTE'
  const [selectedRange, setSelectedRange] = useState('today'); // 'today' or 'all'

  return (
    <div>
      <ChartHeader />
      <PriceChartInfo
        selectedNetwork={selectedNetwork}
        selectedRange={selectedRange}
        onNetworkChange={setSelectedNetwork}
        onRangeChange={setSelectedRange}
      />
      <PriceChart network={selectedNetwork} range={selectedRange} />
      <TradeInfoSection selectedNetwork={selectedNetwork} />
      <TradeActionButtons />
    </div>
  );
};

export default LiveChartPage;
