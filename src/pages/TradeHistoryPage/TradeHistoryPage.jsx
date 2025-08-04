import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import bottomToggleIcon from '@/assets/icon/bottomtoggle.svg';
import { fetchPurchaseData, fetchSaleData } from '@/apis/purchaseApi';
import { AnimatePresence, motion } from 'framer-motion';

import DateRangeModal from './DateRangeModal';
import NetworkFilterModal from './NewWorkFilterModal';
import TradeItemList from './TradeItemList';
import dayjs from 'dayjs';

const getDateLabelByRange = (range) => {
  const today = dayjs();
  switch (range) {
    case 'TODAY':
      return today.format('M월 D일');
    case 'WEEK':
      return `${today.subtract(6, 'day').format('M월 D일')} ~ ${today.format('M월 D일')}`;
    case 'MONTH':
      return `${today.startOf('month').format('M월 D일')} ~ ${today.format('M월 D일')}`;
    case 'YEAR':
      return `${today.startOf('year').format('YYYY년 M월 D일')} ~ ${today.format('M월 D일')}`;
    case 'ALL':
    default:
      return '전체 기간';
  }
};

const tabs = ['구매 내역', '판매 내역'];
const subTabs = ['전체', '완료', '분할 거래', '대기중', '취소'];
const ranges = [
  { label: '전체', value: 'ALL' },
  { label: '오늘', value: 'TODAY' },
  { label: '일주일', value: 'WEEK' },
  { label: '이번달', value: 'MONTH' },
  { label: '일년', value: 'YEAR' },
];

const TradeHistoryPage = () => {
  const [tab, setTab] = useState('구매 내역');
  const [subTab, setSubTab] = useState('전체');
  const [range, setRange] = useState('ALL');
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [networkFilter, setNetworkFilter] = useState('ALL');
  const [data, setData] = useState({
    complete: [],
    partial: [],
    waiting: [],
    canceled: [],
  });
  const [totalData, setTotalData] = useState(0);
  const [totalMileage, setTotalMileage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          tab === '구매 내역' ? await fetchPurchaseData(range) : await fetchSaleData(range);

        // 상태별로 나누기
        let complete = res.filter((item) => item.status === '001');
        let partial = res.filter((item) => item.status === '002');
        let waiting = res.filter((item) => item.status === '003');
        let canceled = res.filter((item) => item.status === '004');

        // 네트워크 필터 적용
        const filterByNetwork = (list) => {
          if (networkFilter === 'LTE') return list.filter((i) => i.dataCode === '001');
          if (networkFilter === '5G') return list.filter((i) => i.dataCode === '002');
          return list;
        };

        complete = filterByNetwork(complete);
        partial = filterByNetwork(partial);
        waiting = filterByNetwork(waiting);
        canceled = filterByNetwork(canceled);

        setData({ complete, partial, waiting, canceled });

        const totalDataList = [...complete, ...partial];
        const sumData = totalDataList.reduce((acc, item) => acc + item.quantity, 0);
        const sumMileage = totalDataList.reduce(
          (acc, item) => acc + item.quantity * item.pricePerGb,
          0
        );

        setTotalData(sumData);
        setTotalMileage(sumMileage);
      } catch (err) {
        console.error('거래 내역 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [tab, range, networkFilter]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = {
    complete: subTab === '전체' || subTab === '완료' ? data.complete : [],
    partial: subTab === '전체' || subTab === '분할 거래' ? data.partial : [],
    waiting: subTab === '전체' || subTab === '대기중' ? data.waiting : [],
    canceled: subTab === '전체' || subTab === '취소' ? data.canceled : [],
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide text-sm text-black">
      <div className="relative mb-2 flex items-center justify-center">
        <div className="absolute left-0">
          <BackButton />
        </div>
        <h2 className="text-center text-lg font-bold">거래 내역</h2>
      </div>

      <button
        onClick={() => setShowRangeModal(true)}
        className="flex items-center justify-center text-base text-gray-600 rounded-full px-3 mb-2 mx-auto"
      >
        <span className="mr-1">{ranges.find((r) => r.value === range)?.label}</span>
        <img src={bottomToggleIcon} alt="열기" className="w-3 h-3" />
      </button>

      <div className="mb-3 text-base">
        <span className="mb-3 font-bold text-gray-600 text-[16px]">
          {getDateLabelByRange(range)}
        </span>
        <div className="flex justify-between text-gray-600 pt-2">
          <span>{tab === '구매 내역' ? '구매한 데이터' : '판매한 데이터'}</span>
          <span
            className={`font-medium ${tab === '구매 내역' ? 'text-blue-600' : 'text-[#FF4343]'}`}
          >
            {totalData}GB
          </span>
        </div>
        <div className="flex justify-between text-gray-600 pt-2">
          <span>{tab === '구매 내역' ? '사용 마일리지' : '획득 마일리지'}</span>
          <span
            className={`font-medium ${tab === '구매 내역' ? 'text-blue-600' : 'text-[#FF4343]'}`}
          >
            {totalMileage.toLocaleString()}P
          </span>
        </div>
        <hr className="border-gray-300 mt-[10px]" />
        <div className="flex justify-between text-gray-600 mt-3">
          <span>대기중인 거래</span>
          <span className="text-black font-medium">
            {Array.isArray(data.waiting) ? data.waiting.length : 0}건
          </span>
        </div>
      </div>

      <div className=" w-full flex justify-between border-b border-gray-300 mb-2">
        <div className="relative  text-[16px] font-bold flex gap-6 pt-[10px]">
          {tabs.map((label) => (
            <button
              key={label}
              onClick={() => {
                setTab(label);
                setSubTab('전체');
              }}
              className={`pb-2 transition-all duration-200 z-10 ${
                tab === label
                  ? label === '판매 내역'
                    ? 'text-[#FF4343]'
                    : 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
          {mounted && (
            <motion.div
              className="absolute bottom-0 h-[2px]"
              initial={false}
              animate={{
                x: tab === '판매 내역' ? 94 : 0,
                backgroundColor: tab === '판매 내역' ? '#FF4343' : '#2563EB',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ width: '70px' }}
            />
          )}
        </div>
        <button onClick={() => setShowNetworkModal(true)} className="h-8 px-3  text-gray-600">
          {networkFilter === 'ALL' ? '전체' : networkFilter}
        </button>
      </div>

      <div className="flex justify-between items-center text-[14px] text-gray-400">
        {subTabs.map((label) => (
          <button
            key={label}
            onClick={() => setSubTab(label)}
            className={`h-8 transition-colors duration-150 ${
              subTab === label ? 'text-gray-600 font-semibold' : ''
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <TradeItemList
        tab={tab}
        completeList={filteredData.complete}
        partialList={filteredData.partial}
        waitingList={filteredData.waiting}
        canceledList={filteredData.canceled}
        networkFilter={networkFilter}
      />

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

      <AnimatePresence>
        {showNetworkModal && (
          <NetworkFilterModal
            show={showNetworkModal}
            selected={networkFilter}
            onSelect={(value) => {
              setNetworkFilter(value);
              setShowNetworkModal(false);
            }}
            onClose={() => setShowNetworkModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradeHistoryPage;
