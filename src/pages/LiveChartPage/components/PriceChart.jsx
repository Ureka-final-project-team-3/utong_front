// src/pages/LiveChartPage/components/PriceChartContainer.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockPriceData } from '../mock/mockPriceData';

const PriceChartContainer = () => {
  return (
    <div className="relative w-[300px] h-[190px] bg-gradient-to-r from-[#2769F6] to-[#757AD0] rounded-[8px] shadow-md overflow-hidden">
      {/* 📊 실시간 차트 */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockPriceData} margin={{ top: 20, right: 30, left: 5, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
              })
            }
            tick={{ fontSize: 8, fill: '#2C2C2C', opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['dataMin - 100', 'dataMax + 100']}
            tick={{ fontSize: 6.5, fill: '#2C2C2C', opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{ fontSize: 10 }}
            formatter={(value) => `${value.toLocaleString()}원`}
          />
          <Line type="monotone" dataKey="price" stroke="#FFFFFF" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {/* ✅ 그래프 아래 텍스트 정보 - flex로 정렬 */}
      <div className="absolute bottom-[6px] left-0 w-full flex justify-center items-center gap-[12px] text-white text-[10px] font-bold opacity-80 pointer-events-none">
        <div className="flex items-center gap-[4px]">
          <span>오늘의 거래량</span>
          <span>1,234,567</span>
        </div>
        <div className="w-[1px] h-[10px] bg-white opacity-80" />
        <div className="flex items-center gap-[4px]">
          <span>등락률</span>
          <span>12.3%</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChartContainer;
