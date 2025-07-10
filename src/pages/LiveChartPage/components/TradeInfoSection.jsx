import React, { useState } from 'react';
import { mockSellBids, mockBuyBids } from '../mock/mockTradeData';

const TradeInfoSection = () => {
  const [tab, setTab] = useState('settled');

  const tabs = [
    { key: 'settled', label: '체결거래' },
    { key: 'sell', label: '판매입찰' },
    { key: 'buy', label: '구매입찰' },
  ];

  const getCurrentData = () => {
    switch (tab) {
      case 'sell':
        return mockSellBids;
      case 'buy':
        return mockBuyBids;
      default:
        return mockSellBids.map(({ price, createdAt }) => ({ price, createdAt }));
    }
  };

  const getMaxQuantity = (data) => (data.length > 0 ? Math.max(...data.map((d) => d.quantity)) : 1);

  const currentData = getCurrentData();
  const maxQuantity = getMaxQuantity([...mockSellBids, ...mockBuyBids]);

  return (
    <div className="w-full px-[30px] pt-3 border-t-[2px] border-[#D9D9D9]">
      {/* 탭 */}
      <div className="flex justify-between w-full mb-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-[14px] font-medium ${
              tab === key ? 'text-[#EB008B]' : 'text-[#2C2C2C]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 헤더 */}
      <div className="relative flex justify-between items-center text-[12px] font-bold text-[#2C2C2C] py-1 border-t-[2px] border-[#D9D9D9]">
        <span className="pl-[5px]">거래가</span>
        <div className="flex items-center space-x-[4px] pr-[5px]">
          <span>{tab === 'settled' ? '시간' : '데이터'}</span>
        </div>
      </div>

      {/* 거래 정보 리스트 */}
      <div className="flex flex-col divide-y divide-[#EEE]">
        {currentData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-[6px] text-[12px] text-[#777777]"
          >
            {/* 거래가 */}
            <div className="w-[80px] text-left">{item.price.toLocaleString()}P</div>

            {/* 오른쪽 영역 */}
            {tab === 'settled' ? (
              <div className="w-[80px] text-right text-[10px] opacity-60">
                {item.createdAt.slice(11, 16)}
              </div>
            ) : (
              <div className="flex items-center w-full justify-end gap-[6px] max-w-[160px]">
                {/* 수량 텍스트: 고정 너비로 정렬 맞추기 */}
                <div className="w-[40px] text-right">{item.quantity}GB</div>

                {/* 그래프 막대: 유동 너비 */}
                <div className="flex-1 h-[10px] bg-[#F0F0F0] rounded-sm overflow-hidden">
                  <div
                    className={`h-full ${tab === 'sell' ? 'bg-[#2769F6]' : 'bg-[#FF4343]'}`}
                    style={{
                      width: `${(item.quantity / maxQuantity) * 100}%`,
                      minWidth: '4px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeInfoSection;
