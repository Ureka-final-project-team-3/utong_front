import React, { useEffect } from 'react';
import ChartHeader from './components/ChartHeader';
import PriceChart from './components/PriceChart';
import PriceChartInfo from './components/PriceChartInfo';
import TradeInfoSection from './components/TradeInfoSection';
import TradeActionButtons from './components/TradeActionButtons';
import { fetchMyInfo } from '@/apis/mypageApi';
import useUserStore from '@/stores/useUserStore';

const LiveChartPage = () => {
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchMyInfo();
        setUserInfo(res); // 또는 res.data 구조에 따라 수정
        console.log(res);
      } catch (err) {
        console.error('사용자 정보 불러오기 실패', err);
      }
    };

    loadUser();
  }, [setUserInfo]);

  return (
    <div>
      <ChartHeader />
      <PriceChartInfo />
      <PriceChart />
      <TradeInfoSection />
      <TradeActionButtons />
    </div>
  );
};

export default LiveChartPage;
