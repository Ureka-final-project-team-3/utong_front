import React, { useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import useTradeStore from '@/stores/tradeStore';
import useOrderQueue from '@/hooks/useOrderQueue'; // 실시간 SSE 훅
import SyncLoading from '@/components/Loading/SyncLoading';

const networkToDataCodeMap = {
  LTE: '001',
  '5G': '002',
};

const TradeInfoSection = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const selectedDataCode = networkToDataCodeMap[selectedNetwork] || selectedNetwork;
  const [tab, setTab] = useState('settled');
  const scrollRef = useRef(null);

  const tabs = [
    { key: 'settled', label: '체결거래' },
    { key: 'buy', label: '구매입찰' },
    { key: 'sell', label: '판매입찰' },
  ];

  const handleTabChange = (key) => {
    setTab(key);
    if (scrollRef.current && scrollRef.current.getScrollElement) {
      scrollRef.current.getScrollElement().scrollTop = 0;
    }
  };

  const { queueData, isLoading } = useOrderQueue(selectedDataCode);
  const { buyOrderQuantity, sellOrderQuantity, recentContracts } = queueData || {};

  const currentData = (() => {
    if (tab === 'sell') {
      return Object.entries(sellOrderQuantity || {})
        .map(([price, quantity]) => ({
          price: Number(price),
          quantity,
        }))
        .sort((a, b) => a.price - b.price);
    }

    if (tab === 'buy') {
      return Object.entries(buyOrderQuantity || {})
        .map(([price, quantity]) => ({
          price: Number(price),
          quantity,
        }))
        .sort((a, b) => b.price - a.price);
    }

    return (recentContracts || [])
      .sort((a, b) => new Date(b.contractedAt) - new Date(a.contractedAt))
      .map(({ price, quantity, contractedAt }) => ({
        price,
        quantity,
        createdAt: contractedAt,
      }));
  })();

  const maxQuantity = Math.max(...currentData.map((d) => d.quantity || 0), 1);
  const highlightFirst = tab !== 'settled' && currentData.length > 0;
  const getPricePrefix = tab === 'sell' ? '최저가:' : tab === 'buy' ? '최고가:' : '';

  return (
    <div className="w-full pt-5 min-h-[225px]">
      {/* 탭 */}
      <div className="flex justify-center gap-x-[30px] w-full border-y-[2px] border-[#D9D9D9] py-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`text-[14px] font-medium cursor-pointer ${
              tab === key ? 'text-[#EB008B]' : 'text-[#2C2C2C]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 헤더 */}
      <div className="relative flex text-[12px] font-bold text-[#2C2C2C] py-1">
        <div className="w-1/2 flex justify-center">거래가</div>
        <div className="w-1/2 flex justify-center">{tab === 'settled' ? '거래일' : '데이터'}</div>
      </div>

      {/* 리스트 */}
      {isLoading ? (
        <SyncLoading text="데이터를 불러오는 중입니다..." />
      ) : (
        <SimpleBar
          style={{ maxHeight: 132 }}
          scrollableNodeProps={{ ref: scrollRef }}
          className={`px-2 mt-[2px] ${
            tab === 'sell'
              ? 'simplebar-sell'
              : tab === 'buy'
                ? 'simplebar-buy'
                : 'simplebar-default'
          }`}
        >
          {/* 상단 강조 */}
          {highlightFirst && (
            <div className="sticky top-0 z-10 flex py-[6px] min-h-[33px] text-[12px] font-bold px-2 bg-[#F6F7FC] border-b border-[#D9D9D9] text-gray-800">
              <div className="w-1/2 flex justify-center items-center gap-1">
                <span className="whitespace-nowrap">{getPricePrefix}</span>
                <span>{currentData[0].price.toLocaleString()}P</span>
              </div>
              <div className="w-1/2 flex justify-center items-center px-2">
                <div className="flex items-center gap-[6px] w-full max-w-[160px]">
                  <div className="w-[40px] text-right">{currentData[0].quantity ?? '-'}GB</div>
                  <div className="flex-1 h-[10px] bg-[#F0F0F0] rounded-sm overflow-hidden">
                    <div
                      className={`h-full ${tab === 'sell' ? 'bg-[#FF4343]' : 'bg-[#2769F6]'}`}
                      style={{
                        width: `${((currentData[0].quantity ?? 0) / maxQuantity) * 100}%`,
                        minWidth: '4px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 항목 목록 */}
          {currentData.length === 0 ? (
            <div className="text-center text-[#777777] py-5">데이터가 없습니다.</div>
          ) : (
            (highlightFirst ? currentData.slice(1) : currentData).map((item, idx) => (
              <div
                key={idx}
                className="flex py-[6px] min-h-[33px] text-[12px] text-[#777777] border-b border-[#EEE]"
              >
                <div className="w-1/2 flex justify-center items-center">
                  {item.price.toLocaleString()}P
                </div>
                <div className="w-1/2 flex justify-center items-center px-2">
                  {tab === 'settled' ? (
                    <span>{item.createdAt.replace('T', ' ').slice(0, 16)}</span>
                  ) : (
                    <div className="flex items-center gap-[6px] w-full max-w-[160px]">
                      <div className="w-[40px] text-right">{item.quantity ?? 0}GB</div>
                      <div className="flex-1 h-[10px] bg-[#F0F0F0] rounded-sm overflow-hidden">
                        <div
                          className={`h-full ${tab === 'sell' ? 'bg-[#FF4343]' : 'bg-[#2769F6]'}`}
                          style={{
                            width: `${((item.quantity ?? 0) / maxQuantity) * 100}%`,
                            minWidth: '4px',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </SimpleBar>
      )}
    </div>
  );
};

export default TradeInfoSection;
