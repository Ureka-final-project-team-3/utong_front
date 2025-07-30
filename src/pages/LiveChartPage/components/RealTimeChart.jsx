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
import useOrderQueue from '@/hooks/useOrderQueue';

const RealtimeChart = ({ dataCode }) => {
  const { queueData, isLoading } = useOrderQueue(dataCode);

  // 최신순이 0번 인덱스니까 오래된 순으로 뒤집기 + 차트 데이터 생성
  const chartData = useMemo(() => {
    if (!queueData?.recentContracts?.length) return [];
    return [...queueData.recentContracts]
      .slice()
      .reverse()
      .map((item, idx) => ({
        timestamp: item.contractedAt || `#${idx + 1}`, // 여기서 timestamp 대신 contractedAt 사용
        price: item.price,
      }));
  }, [queueData]);

  // 등락률 계산
  const changeRate = useMemo(() => {
    if (chartData.length < 2) return '-';
    const first = chartData[0].price;
    const last = chartData[chartData.length - 1].price;
    return (((last - first) / first) * 100).toFixed(1) + '%';
  }, [chartData]);

  if (isLoading) return <div>실시간 데이터 로딩 중...</div>;

  return (
    <div className="bg-gradient-to-r from-[#2769F6] to-[#757AD0] rounded-[8px] shadow-md overflow-hidden flex flex-col">
      <div style={{ height: 165 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 5, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
            <XAxis dataKey="timestamp" hide={true} />
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
                const formattedDate =
                  date.toString() !== 'Invalid Date'
                    ? date.toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                      })
                    : label;
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

export default RealtimeChart;
