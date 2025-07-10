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
    <div className="w-full pt-5">
      {/* 탭 */}
      <div className="flex justify-center gap-x-[30px] w-full border-y-[2px] border-[#D9D9D9] py-2">
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
      <div className="relative flex text-[12px] font-bold text-[#2C2C2C] py-1">
        <div className="w-1/2 flex justify-center">
          <span>거래가</span>
        </div>
        <div className="w-1/2 flex justify-center">
          <span>{tab === 'settled' ? '거래일' : '데이터'}</span>
        </div>
      </div>

      {/* 거래 정보 리스트 (항상 4개까지만 보이고 스크롤) */}
      <div className="max-h-[132px] overflow-y-auto flex flex-col divide-y divide-[#EEE] px-2">
        {currentData.map((item, index) => (
          <div key={index} className="flex py-[6px] text-[12px] text-[#777777] min-h-[33px]">
            {/* 거래가 */}
            <div className="w-1/2 flex justify-center items-center">
              {item.price.toLocaleString()}P
            </div>

            {/* 날짜 or 그래프 */}
            <div className="w-1/2 flex justify-center items-center">
              {tab === 'settled' ? (
                <span className="text-[#777777] text-[12px]">
                  {item.createdAt.replace('T', ' ').slice(0, 16)}
                </span>
              ) : (
                <div className="flex items-center gap-[6px] w-full max-w-[160px]">
                  <div className="w-[40px] text-right">{item.quantity}GB</div>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeInfoSection;
