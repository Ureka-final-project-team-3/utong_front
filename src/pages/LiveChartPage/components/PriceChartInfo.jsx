import React from 'react';
import useTradeStore from '@/stores/tradeStore';
import useOrderQueue from '@/hooks/useOrderQueue';

const PriceChartInfo = () => {
  const { selectedNetwork, selectedRange, setSelectedNetwork, setSelectedRange } = useTradeStore();

  const networkToDataCode = {
    LTE: '001',
    '5G': '002',
  };
  const dataCode = networkToDataCode[selectedNetwork] || '002';

  const { queueData, isLoading } = useOrderQueue(dataCode);
  const recentContracts = queueData?.recentContracts ?? [];
  const latestContract = recentContracts[0];
  const latestPrice = latestContract?.price ?? null;

  console.log('📈 최근 거래가:', latestPrice);

  return (
    <div className="relative w-full max-w-full sm:max-w-[300px] mt-[20px] mb-[10px] px-4 sm:px-0">
      <div className="text-[18px] sm:text-[20px] leading-[24px] text-[#2C2C2C]">최근 거래가</div>
      <div className="flex items-end gap-2 mt-1 min-h-[36px]">
        {isLoading ? (
          <span className="text-[18px] sm:text-[20px] leading-[24px] sm:leading-[26px] font-medium text-[#999]">
            최근 거래가 불러오는 중...
          </span>
        ) : (
          <>
            <span className="text-[26px] sm:text-[30px] leading-[32px] sm:leading-[36px] font-bold text-[#EB008B]">
              {latestPrice !== null ? latestPrice.toLocaleString() : '-'}
            </span>
            <span className="text-[12px] leading-[15px] text-[#2C2C2C]">P (1GB)</span>
          </>
        )}
      </div>

      {/* 네트워크 선택 */}
      <div className="absolute right-2 top-2 sm:top-2 flex flex-col gap-[10px]">
        {['5G', 'LTE'].map((type) => (
          <div
            key={type}
            className="flex items-center cursor-pointer"
            onClick={() => setSelectedNetwork(type)}
          >
            <div
              className={`w-[13px] h-[13px] rounded-full mr-[10px] ${
                selectedNetwork === type ? 'bg-[#5732A1]' : 'bg-[#D9D9D9]'
              }`}
            />
            <span
              className={`text-[13px] sm:text-[14px] font-bold ${
                selectedNetwork === type ? 'text-[#2C2C2C]' : 'text-[#6A6666]'
              }`}
            >
              {type}
            </span>
          </div>
        ))}
      </div>

      {/* 시세 범위 선택 */}
      <div className="mt-5 flex justify-center items-center gap-4 sm:gap-4">
        <span
          className={`text-[13px] sm:text-[14px] cursor-pointer ${
            selectedRange === 'today' ? 'text-[#EB008B] font-bold' : 'text-[#2C2C2C]'
          }`}
          onClick={() => setSelectedRange('today')}
        >
          최근 시세
        </span>
        <div className="w-[2px] h-[20px] bg-[#D9D9D9]" />
        <span
          className={`text-[13px] sm:text-[14px] cursor-pointer ${
            selectedRange === 'all' ? 'text-[#EB008B] font-bold' : 'text-[#2C2C2C]'
          }`}
          onClick={() => setSelectedRange('all')}
        >
          주간 시세
        </span>
      </div>
    </div>
  );
};

export default PriceChartInfo;
