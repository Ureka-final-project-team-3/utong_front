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
const subTabs = ['전체', '거래완료', '대기중'];
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
  const [data, setData] = useState({ complete: [], waiting: [] });
  const [totalData, setTotalData] = useState(0);
  const [totalMileage, setTotalMileage] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          tab === '구매 내역' ? await fetchPurchaseData(range) : await fetchSaleData(range);

        let complete = tab === '구매 내역' ? res.completePurchases : res.completeSales;
        let waiting = tab === '구매 내역' ? res.waitingPurchases : res.waitingSales;

        // 회선 필터링 적용
        if (networkFilter === 'LTE') {
          complete = complete.filter((item) => item.dataCode === '001');
          waiting = waiting.filter((item) => item.dataCode === '001');
        } else if (networkFilter === '5G') {
          complete = complete.filter((item) => item.dataCode === '002');
          waiting = waiting.filter((item) => item.dataCode === '002');
        }

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
  }, [tab, range, networkFilter]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = {
    complete: subTab === '전체' || subTab === '거래완료' ? data.complete : [],
    waiting: subTab === '전체' || subTab === '대기중' ? data.waiting : [],
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide text-sm text-black">
      <div className="relative mb-2 flex items-center justify-center">
        {/* 좌측 백버튼 */}
        <div className="absolute left-0">
          <BackButton />
        </div>

        {/* 가운데 타이틀 */}
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
          <span className="text-black font-medium">{data.waiting.length}건</span>
        </div>
      </div>

      <div className="relative border-b border-gray-300 mb-2 text-[16px] font-bold flex gap-6 pt-[10px]">
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

      <div className="flex justify-between items-center text-[14px] text-gray-400">
        {/* 왼쪽 탭 버튼들 */}
        <div className="flex gap-4">
          {subTabs.map((label) => (
            <button
              key={label}
              onClick={() => setSubTab(label)}
              className={`h-8  transition-colors duration-150 ${
                subTab === label ? 'text-gray-600 font-semibold' : ''
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 오른쪽 필터 버튼 */}
        <button
          onClick={() => setShowNetworkModal(true)}
          className="h-8 px-3 rounded-full border border-gray-300 text-gray-600"
        >
          {networkFilter === 'ALL' ? '전체' : networkFilter}
        </button>
      </div>

      <TradeItemList
        tab={tab}
        completeList={filteredData.complete}
        waitingList={filteredData.waiting}
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
