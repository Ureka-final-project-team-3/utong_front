import React from 'react';
import useTradeStore from '@/stores/tradeStore';
import TodayPriceChart from './TodayPriceChart';
import WeeklyPriceChart from './WeeklyPriceChart';

const PriceChartContainer = () => {
  const selectedRange = useTradeStore((state) => state.selectedRange);

  return selectedRange === 'today' ? <TodayPriceChart /> : <WeeklyPriceChart />;
};

export default PriceChartContainer;
