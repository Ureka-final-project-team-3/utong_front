import SyncLoading from '@/components/Loading/SyncLoading';
import ChartHeader from './components/ChartHeader';
import PriceChartInfo from './components/PriceChartInfo';
import PriceChart from './components/PriceChart';
import RealtimeChart from './components/RealTimeChart'; // 추가
import TradeInfoSection from './components/TradeInfoSection';
import TradeActionButtons from './components/TradeActionButtons';
import useAuth from '@/hooks/useAuth';
import useTradeStore from '@/stores/tradeStore';

const LiveChartPage = () => {
  const { user, isLoading } = useAuth();
  const selectedRange = useTradeStore((state) => state.selectedRange);
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);

  const networkToDataCode = { LTE: '001', '5G': '002' };
  const dataCode = networkToDataCode[selectedNetwork] || '002';

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

      {/* selectedRange가 realtime이면 RealtimeChart, 아니면 기존 PriceChart */}
      {selectedRange === 'realtime' ? <RealtimeChart dataCode={dataCode} /> : <PriceChart />}

      <TradeInfoSection />
      <TradeActionButtons />
    </div>
  );
};

export default LiveChartPage;
