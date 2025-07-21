import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import loadingIcon from '@/assets/image/loading.png';
import checkIcon from '@/assets/image/check.png';
import redcheckIcon from '@/assets/icon/redcheck.svg';
import { fetchPurchaseData, fetchSaleData } from '@/apis/purchaseApi';
import dayjs from 'dayjs';

const tabs = ['구매 내역', '판매 내역'];
const subTabs = ['전체', '거래완료', '대기중'];
const ranges = [
  { label: '일', value: 'DAY' },
  { label: '주', value: 'WEEK' },
  { label: '월', value: 'MONTH' },
  { label: '년', value: 'YEAR' },
  { label: '전체', value: 'ALL' },
];

const getDateRangeLabel = (range) => {
  const today = dayjs();
  switch (range) {
    case 'DAY':
      return today.format('MM월 DD일');
    case 'WEEK':
      return `${today.subtract(6, 'day').format('MM월 DD일')} ~ ${today.format('MM월 DD일')}`;
    case 'MONTH':
      return `${today.startOf('month').format('MM월 DD일')} ~ ${today.format('MM월 DD일')}`;
    case 'YEAR':
      return `${today.startOf('year').format('YYYY년 MM월 DD일')} ~ ${today.format('MM월 DD일')}`;
    case 'ALL':
    default:
      return '전체';
  }
};

const TradeHistoryPage = () => {
  const [tab, setTab] = useState('구매 내역');
  const [subTab, setSubTab] = useState('전체');
  const [range, setRange] = useState('WEEK');
  const [data, setData] = useState({ complete: [], waiting: [] });
  const [dateLabel, setDateLabel] = useState(getDateRangeLabel('WEEK'));
  const [totalData, setTotalData] = useState(0);
  const [totalMileage, setTotalMileage] = useState(0);

  useEffect(() => {
    setDateLabel(getDateRangeLabel(range));

    const fetchData = async () => {
      try {
        const res =
          tab === '구매 내역' ? await fetchPurchaseData(range) : await fetchSaleData(range);

        const complete = tab === '구매 내역' ? res.completePurchases : res.completeSales;
        const waiting = tab === '구매 내역' ? res.waitingPurchases : res.waitingSales;

        setData({ complete, waiting });

        // ✅ 완료된 거래만 기준으로 합산
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

  const groupByDate = (items) => {
    return items.reduce((acc, item) => {
      const date = formatDate(item.tradeDate);
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  const renderItems = (items, isWaiting) => {
    const grouped = groupByDate(items);
    return Object.entries(grouped).map(([date, list]) => (
      <div key={date}>
        <p className="text-sm font-semibold text-[#444] mt-4 mb-1">{date}</p>
        <div className="flex flex-col gap-2">
          {list.map((item, idx) => {
            const icon = isWaiting ? loadingIcon : tab === '판매 내역' ? redcheckIcon : checkIcon;
            const status = isWaiting ? '거래 대기중' : '거래 완료';
            const statusColor = isWaiting
              ? 'text-gray-400'
              : tab === '판매 내역'
                ? 'text-[#FF4343]'
                : 'text-blue-600';
            const key = `${item.purchaseId || item.saleId}-${idx}`;
            return (
              <div key={key} className="border-b py-2">
                <div className="flex items-center gap-2 text-sm">
                  <img src={icon} alt="status" className="w-4 h-4" />
                  <span className={`${statusColor} font-medium`}>{status}</span>
                  <span className="text-black font-medium ml-2">
                    {item.dataCode === '001' ? 'LTE 데이터' : '5G 데이터'}
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-600">
                  <span>1GB당 {item.pricePerGb.toLocaleString()}P</span>
                  <span>총 {(item.pricePerGb * item.quantity).toLocaleString()}P</span>
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
    <div>
      {/* 헤더 */}
      <div className="flex items-center mb-4 relative">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
          거래 내역
        </h2>
        <div className="w-6" />
      </div>

      {/* 기간 버튼 */}
      <div className="flex gap-3 mb-2 text-xs text-gray-500">
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={`${
              range === r.value ? 'font-bold text-black' : 'text-gray-400'
            } transition-all`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* 날짜 텍스트 */}
      <div className="text-base font-semibold mb-1">{dateLabel}</div>

      {/* ✅ 총 구매한 데이터 및 사용한 마일리지 */}
      <div className="mb-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>구매한 데이터</span>
          <span className="text-black font-medium">{totalData}GB</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>사용한 마일리지</span>
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
            className={`flex-1 pb-2 ${
              tab === label ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
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

      {/* 거래 내역 리스트 */}
      <div className="text-sm text-black">
        {renderItems(filteredData.waiting, true)}
        {renderItems(filteredData.complete, false)}
      </div>
    </div>
  );
};

export default TradeHistoryPage;
