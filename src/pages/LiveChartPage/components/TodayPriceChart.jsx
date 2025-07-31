import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useTradeStore from '@/stores/tradeStore';
import useLivePriceStore from '@/stores/useLivePriceStore';

const TodayPriceChart = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const dataCode = selectedNetwork === '5G' ? '002' : '001';

  // Zustand에서 실시간 가격 데이터 구독
  const allPriceMap = useLivePriceStore((state) => state.allPriceMap);
  const liveData = allPriceMap[dataCode] || [];

  // 오늘 날짜 문자열 (ko-KR)
  const todayStrKST = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // 오늘 데이터만 필터링
  const filteredData = useMemo(() => {
    if (!liveData.length) return [];

    return liveData
      .filter((item) => {
        const itemDateStr = new Date(item.aggregatedAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        return itemDateStr === todayStrKST;
      })
      .map((item) => ({
        timestamp: item.aggregatedAt,
        price: item.avgPrice,
        volume: item.volume || 0,
      }));
  }, [liveData, todayStrKST]);

  // 등락률 계산
  const changeRate = useMemo(() => {
    if (filteredData.length < 2) return '-';
    const first = filteredData[0].price;
    const last = filteredData[filteredData.length - 1].price;
    return (((last - first) / first) * 100).toFixed(1) + '%';
  }, [filteredData]);

  return (
    <div className="bg-gradient-to-r from-[#2769F6] to-[#757AD0] rounded-[8px] shadow-md overflow-hidden flex flex-col">
      <div className="h-[165px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 20, left: 5, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString('ko-KR', { hour: '2-digit', hour12: false });
              }}
              tick={{ fontSize: 8, fill: '#FFFFFF', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              textAnchor="middle"
              dy={5}
            />
            <YAxis
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => Math.round(value / 100) * 100}
              tick={{ fontSize: 6.5, fill: '#FFFFFF', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip
              content={({ label, payload }) => {
                if (!payload || payload.length === 0) return null;
                const date = new Date(label);
                const formattedDate = date.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: false,
                });
                const rawPrice = payload[0].value;
                const roundedPrice = Math.round(rawPrice / 100) * 100;
                return (
                  <div className="bg-white text-black text-[10px] rounded px-2 py-1 shadow-md">
                    <div>{formattedDate}</div>
                    <div>{`${roundedPrice.toLocaleString()}P`}</div>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="price" stroke="#FFFFFF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full flex justify-center items-center gap-[12px] text-white text-[10px] font-bold opacity-80 py-[6px]">
        <div className="flex items-center gap-[6px]">
          <span>등락률</span>
          <span>{changeRate}</span>
        </div>
      </div>
    </div>
  );
};

export default TodayPriceChart;
