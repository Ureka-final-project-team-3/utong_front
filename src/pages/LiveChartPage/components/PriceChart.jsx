import React, { useMemo, useEffect, useState } from 'react';
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
import useLivePriceStore from '@/stores/useLivePriceStore'; // Zustand store import
import { getWeeklyPrices } from '@/apis/weekprice';

const PriceChartContainer = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const selectedRange = useTradeStore((state) => state.selectedRange);

  const dataCode = selectedNetwork === '5G' ? '002' : '001';

  // Zustand에서 전역 실시간 가격 데이터 맵 상태 구독
  const allPriceMap = useLivePriceStore((state) => state.allPriceMap);

  // 선택한 dataCode에 해당하는 실시간 데이터 배열
  const liveData = allPriceMap[dataCode] || [];

  // 주간 시세 API 결과 상태
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    if (selectedRange !== 'today') {
      getWeeklyPrices(dataCode)
        .then((res) => {
          if (res?.data?.dailyChartDtoList) {
            const chartData = res.data.dailyChartDtoList.map((item) => ({
              timestamp: item.date,
              price: item.avgPrice,
              volume: 0,
            }));
            setWeeklyData(chartData);
          } else {
            setWeeklyData([]);
          }
        })
        .catch(() => setWeeklyData([]));
    }
  }, [selectedRange, dataCode]);

  const filteredData = useMemo(() => {
    if (selectedRange === 'today') {
      if (!liveData || liveData.length === 0) return [];

      const todayStrKST = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const filtered = liveData.filter((item) => {
        const itemDateStr = new Date(item.aggregatedAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        return itemDateStr === todayStrKST;
      });

      return filtered.map((item) => ({
        timestamp: item.aggregatedAt,
        price: item.avgPrice,
        volume: item.volume || 0,
      }));
    } else {
      return weeklyData;
    }
  }, [liveData, selectedRange, weeklyData]);

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
                return selectedRange === 'today'
                  ? date.toLocaleTimeString('ko-KR', { hour: '2-digit', hour12: false })
                  : date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
              }}
              tick={{ fontSize: 8, fill: '#FFFFFF', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              textAnchor="end"
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
                  hour: selectedRange === 'today' ? 'numeric' : undefined,
                  hour12: true,
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
          <span>
            {filteredData.length > 1
              ? `${(((filteredData.at(-1).price - filteredData[0].price) / filteredData[0].price) * 100).toFixed(1)}%`
              : '-'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceChartContainer;
