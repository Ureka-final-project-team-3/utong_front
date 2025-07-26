import SyncLoading from '@/components/Loading/SyncLoading';
import ChartHeader from './components/ChartHeader';
import PriceChart from './components/PriceChart';
import PriceChartInfo from './components/PriceChartInfo';
import TradeInfoSection from './components/TradeInfoSection';
import TradeActionButtons from './components/TradeActionButtons';
import useAuth from '@/hooks/useAuth';

const LiveChartPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoading text="데이터를 불러오는 중입니다..." />
      </div>
    );
  }

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
