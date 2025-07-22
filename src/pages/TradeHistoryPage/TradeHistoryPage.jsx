// src/pages/TradeHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import loadingIcon from '@/assets/image/loading.png';
import checkIcon from '@/assets/image/check.png';
import redcheckIcon from '@/assets/icon/redcheck.svg';
import bgImage from '@/assets/image/background4.png';
import bottomToggleIcon from '@/assets/icon/bottomtoggle.svg';
import { fetchPurchaseData, fetchSaleData } from '@/apis/purchaseApi';
import { AnimatePresence } from 'framer-motion';
import NavigationBar from '@/components/NavigationBar/NavigationBar';
import DateRangeModal from './DateRangeModal';

const tabs = ['구매 내역', '판매 내역'];
const subTabs = ['전체', '거래완료', '대기중'];
const ranges = [
  { label: '일주일', value: 'WEEK' },
  { label: '한달', value: 'MONTH' },
  { label: '전체', value: 'YEAR' },
];

const TradeHistoryPage = () => {
  const [tab, setTab] = useState('구매 내역');
  const [subTab, setSubTab] = useState('전체');
  const [range, setRange] = useState('WEEK');
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [data, setData] = useState({ complete: [], waiting: [] });
  const [totalData, setTotalData] = useState(0);
  const [totalMileage, setTotalMileage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          tab === '구매 내역' ? await fetchPurchaseData(range) : await fetchSaleData(range);

        const complete = tab === '구매 내역' ? res.completePurchases : res.completeSales;
        const waiting = tab === '구매 내역' ? res.waitingPurchases : res.waitingSales;
        setData({ complete, waiting });

        const sumData = complete.reduce((acc, item) => acc + item.quantity, 0);
        const sumMileage = complete.reduce((acc, item) => acc + item.quantity * item.pricePerGb, 0);
        setTotalData(sumData);
        setTotalMileage(sumMileage);
      } catch (err) {
        console.error('거래 내역 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [tab, range]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${String(date.getDate()).padStart(2, '0')}일`;
  };

  const renderGroupedItems = (completeList, waitingList) => {
    const allItems = [
      ...waitingList.map((i) => ({ ...i, isWaiting: true })),
      ...completeList.map((i) => ({ ...i, isWaiting: false })),
    ];
    const grouped = allItems.reduce((acc, item) => {
      const date = formatDate(item.tradeDate);
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, list]) => (
      <div key={date}>
        <p className="text-sm font-bold text-[#444] mt-4 mb-1">{date}</p>
        <div className="flex flex-col gap-2">
          {list
            .sort((a, b) => (a.isWaiting === b.isWaiting ? 0 : a.isWaiting ? -1 : 1))
            .map((item, idx) => {
              const icon = item.isWaiting
                ? loadingIcon
                : tab === '판매 내역'
                  ? redcheckIcon
                  : checkIcon;
              const status = item.isWaiting ? '거래 대기중' : '거래 완료';
              const statusColor = item.isWaiting
                ? 'text-gray-400'
                : tab === '판매 내역'
                  ? 'text-[#FF4343]'
                  : 'text-blue-600';
              const key = `${item.purchaseId || item.saleId}-${idx}`;
              return (
                <div key={key} className="border-b border-gray-300 py-2">
                  {/* 상단 상태 + 데이터 타입 */}
                  <div className="flex items-center gap-2 text-sm">
                    <img src={icon} alt="status" className="w-4 h-4" />
                    <span className={`${statusColor} font-medium`}>{status}</span>
                    <span className="text-black font-medium ml-2">
                      {item.dataCode === '001' ? 'LTE 데이터' : '5G 데이터'}
                    </span>
                  </div>

                  {/* 하단 정보 정렬: 좌측 "1GB당", 우측 "총 가격" */}
                  <div className="flex justify-between mt-1 text-xs text-gray-600">
                    <span className="text-left">1GB당 {item.pricePerGb.toLocaleString()}P</span>
                    <span className="text-right">
                      {item.quantity}GB / 총 {(item.pricePerGb * item.quantity).toLocaleString()}P
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    ));
  };

  const filteredData = {
    complete: subTab === '전체' || subTab === '거래완료' ? data.complete : [],
    waiting: subTab === '전체' || subTab === '대기중' ? data.waiting : [],
  };

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 w-full h-full flex justify-end items-center">
        <div className="relative w-full h-full sm:w-[360px] sm:h-[780px] bg-white shadow-xl flex flex-col overflow-hidden sm:mr-[500px]">
          <div className="flex-1 overflow-y-auto px-[30px] pt-[55px] pb-[30px] bg-background relative">
            <div className="flex items-center mb-4 relative">
              <BackButton />
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <h2 className="text-lg font-bold">거래 내역</h2>
              </div>
            </div>

            {/* 날짜 선택 버튼 */}
            <button
              onClick={() => setShowRangeModal(true)}
              className="flex items-center justify-center text-base text-gray-600 rounded-full px-3 mb-4 mx-auto"
            >
              <span className="mr-1">{ranges.find((r) => r.value === range)?.label}</span>
              <img src={bottomToggleIcon} alt="열기" className="w-3 h-3" />
            </button>

            {/* 요약 정보 */}
            <div className="mb-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>구매 데이터</span>
                <span className="text-black font-medium">{totalData}GB</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>사용 마일리지</span>
                <span className="text-black font-medium">{totalMileage.toLocaleString()}P</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-1">
                <span>대기중인 거래</span>
                <span className="text-black font-medium">{data.waiting.length}건</span>
              </div>
            </div>

            {/* 탭 */}
            <div className="flex border-b border-gray-200 mb-2 text-[15px] font-medium">
              {tabs.map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    setTab(label);
                    setSubTab('전체');
                  }}
                  className={`flex-1 pb-2 ${tab === label ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 서브 탭 */}
            <div className="mb-2 text-[14px] text-gray-500">
              {subTabs.map((label) => (
                <button
                  key={label}
                  onClick={() => setSubTab(label)}
                  className={`flex-1 mr-2 pb-2 ${subTab === label ? 'text-black font-semibold' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 거래 내역 */}
            <div className="text-sm text-black pb-20">
              {renderGroupedItems(filteredData.complete, filteredData.waiting)}
            </div>
          </div>

          {/* 날짜 모달 */}
          <AnimatePresence>
            {showRangeModal && (
              <DateRangeModal
                show={showRangeModal}
                range={range}
                ranges={ranges}
                onSelect={(selected) => {
                  setRange(selected);
                  setShowRangeModal(false);
                }}
                onClose={() => setShowRangeModal(false)}
              />
            )}
          </AnimatePresence>

          <div className="h-[49px] w-full fixed bottom-0 left-1/2 -translate-x-1/2 sm:static sm:left-auto sm:translate-x-0 z-10">
            <NavigationBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeHistoryPage;
