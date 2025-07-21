import React, { useState } from 'react';
import useTradeStore from '@/stores/tradeStore';
import { mockSellBids, mockBuyBids } from '../mock/mockTradeData';

const networkToDataCodeMap = {
  LTE: '001',
  '5G': '002',
};

const TradeInfoSection = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const selectedDataCode = networkToDataCodeMap[selectedNetwork] || selectedNetwork;

  const [tab, setTab] = useState('settled');

  const tabs = [
    { key: 'settled', label: '체결거래' },
    { key: 'buy', label: '구매입찰' },
    { key: 'sell', label: '판매입찰' },
  ];

  const getCurrentData = () => {
    switch (tab) {
      case 'sell':
        return [...mockSellBids]
          .filter((item) => item.dataCode === selectedDataCode)
          .sort((a, b) => a.price - b.price);
      case 'buy':
        return [...mockBuyBids]
          .filter((item) => item.dataCode === selectedDataCode)
          .sort((a, b) => b.price - a.price);
      case 'settled':
      default:
        return mockSellBids
          .filter((item) => item.dataCode === selectedDataCode)
          .map(({ price, createdAt }) => ({ price, createdAt }));
    }
  };

  const currentData = getCurrentData();

  const maxQuantity = Math.max(
    ...[...mockSellBids, ...mockBuyBids]
      .filter((d) => d.dataCode === selectedDataCode)
      .map((d) => d.quantity || 0)
  );

  const highlightFirst = tab !== 'settled' && currentData.length > 0;

  const getHighlightBorderColor = () => {
    if (tab === 'sell') return 'border-[#FF4343]';
    if (tab === 'buy') return 'border-[#2769F6]';
    return 'border-[#EEE]';
  };

  const getPricePrefix = () => {
    if (tab === 'sell') return '최저가:';
    if (tab === 'buy') return '최고가:';
    return '';
  };

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

      {/* 고정된 첫 항목 (구매/판매입찰만) */}
      {highlightFirst && (
        <div
          className={`flex py-[6px] text-[12px] min-h-[33px] text-[#777777] font-bold px-2 bg-[#F6F7FC] border ${getHighlightBorderColor()} border-[1px]`}
        >
          <div className="w-1/2 flex justify-center items-center gap-1">
            <span className="text-left whitespace-nowrap">{getPricePrefix()}</span>
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

      {/* 거래 정보 리스트 */}
      <div
        className={`overflow-y-auto flex flex-col divide-y divide-[#EEE] px-2 mt-[2px] ${
          highlightFirst ? 'max-h-[99px]' : 'max-h-[132px]'
        }`}
      >
        {currentData.length === 0 ? (
          <div className="text-center text-[#777777] py-5">데이터가 없습니다.</div>
        ) : (
          (highlightFirst ? currentData.slice(1) : currentData).map((item, index) => (
            <div
              key={index + (highlightFirst ? 1 : 0)}
              className="flex py-[6px] text-[12px] text-[#777777] min-h-[33px]"
            >
              <div className="w-1/2 flex justify-center items-center">
                {item.price.toLocaleString()}P
              </div>
              <div className="w-1/2 flex justify-center items-center px-2">
                {tab === 'settled' ? (
                  <span className="text-[12px]">
                    {item.createdAt.replace('T', ' ').slice(0, 16)}
                  </span>
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
      </div>
    </div>
  );
};

export default TradeInfoSection;
