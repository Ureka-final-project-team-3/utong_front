import React, { useState } from 'react';
import { mockSellBids, mockBuyBids } from '../mock/mockTradeData';

const TradeInfoSection = () => {
  const [tab, setTab] = useState('settled'); // 'settled' | 'sell' | 'buy'

  const tabs = [
    { key: 'settled', label: '체결거래' },
    { key: 'sell', label: '판매입찰' },
    { key: 'buy', label: '구매입찰' },
  ];

  // 최대 수량 계산 (막대그래프 길이 비율용)
  const getMaxQuantity = (data) => (data.length > 0 ? Math.max(...data.map((d) => d.quantity)) : 1);

  // 탭별 표시 데이터 가져오기
  const getCurrentData = () => {
    switch (tab) {
      case 'sell':
        return mockSellBids;
      case 'buy':
        return mockBuyBids;
      default:
        // 체결거래: 판매 mock 기준
        return mockSellBids.map((item) => ({
          price: item.price,
          createdAt: item.createdAt,
        }));
    }
  };

  const currentData = getCurrentData();
  const maxQuantity = getMaxQuantity([...mockSellBids, ...mockBuyBids]);

  return (
    <div className="w-full px-2 mt-4 border-t-[2px] border-[#D9D9D9] pt-3">
      {/* 탭 버튼 */}
      <div className="flex justify-around text-[14px] font-semibold mb-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-2 py-1 ${tab === key ? 'text-[#EB008B]' : 'text-[#2C2C2C]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 헤더: 거래가 / 데이터 또는 시간 */}
      <div className="flex justify-between text-[#2C2C2C] text-[12px] font-bold px-1 pb-1 border-t-[2px] border-[#D9D9D9]">
        <span className="w-1/2 text-left">거래가</span>
        <span className="w-1/2 text-right">{tab === 'settled' ? '시간' : '데이터'}</span>
      </div>

      {/* 거래 정보 */}
      <div className="flex flex-col divide-y divide-[#EEE] text-[#777] text-[12px]">
        {currentData.map((item, i) => (
          <div key={i} className="flex justify-between items-center px-1 py-[6px]">
            {/* 거래가 - 좌측 끝 */}
            <div className="flex-1 text-left">{item.price.toLocaleString()}P</div>

            {/* 시간 또는 데이터 - 우측 끝 */}
            {tab === 'settled' ? (
              <div className="flex-1 text-right text-[10px] opacity-60">
                {item.createdAt.slice(11, 16)}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-end">
                <div>{item.quantity}GB</div>
                <div
                  className={`h-[15px] mt-[2px] rounded-sm ${
                    tab === 'sell' ? 'bg-[#2769F6]' : 'bg-[#FF4343]'
                  }`}
                  style={{
                    width: `${(item.quantity / maxQuantity) * 40}px`,
                    minWidth: '4px',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeInfoSection;
