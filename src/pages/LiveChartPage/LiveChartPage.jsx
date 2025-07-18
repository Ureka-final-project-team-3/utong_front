import ChartHeader from './components/ChartHeader';
import PriceChart from './components/PriceChart';
import PriceChartInfo from './components/PriceChartInfo';
import TradeInfoSection from './components/TradeInfoSection';
import TradeActionButtons from './components/TradeActionButtons';

const LiveChartPage = () => {
  return (
    <div className="h-auto max-md:h-[100dvh] max-md:overflow-y-auto">
      <ChartHeader />
      <PriceChartInfo />
      <PriceChart />
      <TradeInfoSection />
      <TradeActionButtons />
    </div>
  );
};

export default LiveChartPage;
