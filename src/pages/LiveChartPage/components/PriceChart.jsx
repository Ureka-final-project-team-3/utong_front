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
import { PriceData5G, PriceDataLTE } from '../mock/mockPriceData';
import { getAveragePriceByDate } from '../../../utils/getAveragePriceByDate';

const PriceChartContainer = ({ network, range }) => {
  const rawData = network === '5G' ? PriceData5G : PriceDataLTE;

  const filteredData = useMemo(() => {
    if (!rawData) return [];

    const todayStr = new Date().toISOString().split('T')[0];

    if (range === 'today') {
      return rawData.filter((item) => {
        const itemDateStr = new Date(item.timestamp).toISOString().split('T')[0];
        return itemDateStr === todayStr;
      });
    } else {
      return getAveragePriceByDate(rawData).map((d) => ({
        timestamp: d.date,
        price: d.averagePrice,
        volume: d.totalVolume,
      }));
    }
  }, [rawData, range]);
  return (
    <div className=" bg-gradient-to-r from-[#2769F6] to-[#757AD0] rounded-[8px] shadow-md overflow-hidden flex flex-col">
      <div className="h-[165px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 20, left: 5, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('ko-KR', {
                  month: '2-digit',
                  day: '2-digit',
                })
              }
              tick={{ fontSize: 8, fill: '#FFFFFF', opacity: 0.6 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin - 100', 'dataMax + 100']}
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
                  minute: '2-digit',
                  hour12: true,
                });
                const price = payload[0].value;

                return (
                  <div className="bg-white text-black text-[10px] rounded px-2 py-1 shadow-md">
                    <div>{formattedDate}</div>
                    <div>{`${price.toLocaleString()}원`}</div>
                  </div>
                );
              }}
            />
            <Line type="monotone" dataKey="price" stroke="#FFFFFF" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full flex justify-center items-center gap-[12px] text-white text-[10px] font-bold opacity-80 py-[6px]">
        <div className="flex items-center gap-[4px]">
          <span>{range === 'today' ? '오늘의 거래량' : '총 거래량'}</span>
          <span>{filteredData.reduce((sum, d) => sum + (d.volume || 0), 0).toLocaleString()}</span>
        </div>
        <div className="w-[1px] h-[10px] bg-white opacity-80" />
        <div className="flex items-center gap-[4px]">
          <span>등락률</span>
          <span>
            {filteredData.length > 1
              ? `${(
                  ((filteredData.at(-1).price - filteredData[0].price) / filteredData[0].price) *
                  100
                ).toFixed(1)}%`
              : '-'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceChartContainer;
