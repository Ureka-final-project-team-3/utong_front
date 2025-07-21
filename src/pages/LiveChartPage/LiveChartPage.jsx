import ChartHeader from './components/ChartHeader';
import PriceChart from './components/PriceChart';
import PriceChartInfo from './components/PriceChartInfo';
import TradeInfoSection from './components/TradeInfoSection';
import TradeActionButtons from './components/TradeActionButtons';
import useAuth from '@/hooks/useAuth'; // 커스텀 훅 import

const LiveChartPage = () => {
  const { user, isLoading } = useAuth(); // 인증 체크

  // 인증 로딩 중일 때는 로딩 화면 표시 (또는 null로 아무것도 렌더링하지 않음)
  if (isLoading) {
    return null; // 또는 <div>Loading...</div>
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
