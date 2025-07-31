import React, { useEffect, useState, useMemo } from 'react';
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
import { getWeeklyPrices } from '@/apis/weekprice';

const WeeklyPriceChart = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const dataCode = selectedNetwork === '5G' ? '002' : '001';

  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
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
  }, [dataCode]);

  const changeRate = useMemo(() => {
    if (weeklyData.length < 2) return '-';
    const first = weeklyData[0].price;
    const last = weeklyData[weeklyData.length - 1].price;
    return (((last - first) / first) * 100).toFixed(1) + '%';
  }, [weeklyData]);

  return (
    <div className="bg-gradient-to-r from-[#2769F6] to-[#757AD0] rounded-[8px] shadow-md overflow-hidden flex flex-col">
      <div className="h-[165px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyData} margin={{ top: 20, right: 20, left: 5, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
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
                const formattedDate = date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
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

export default WeeklyPriceChart;
