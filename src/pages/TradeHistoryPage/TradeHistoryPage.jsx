// src/pages/TradeHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import loadingIcon from '@/assets/image/loading.png';
import checkIcon from '@/assets/image/check.png';
import redcheckIcon from '@/assets/icon/redcheck.svg';
import { motion } from 'framer-motion';
import { fetchPurchaseData, fetchSaleData } from '@/apis/purchaseApi';

motion.div = motion;

const tabs = ['구매 내역', '판매 내역'];

const TradeHistoryPage = () => {
  const [tab, setTab] = useState('구매 내역');
  const [range, setRange] = useState('WEEK');
  const [data, setData] = useState({ complete: [], waiting: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          tab === '구매 내역' ? await fetchPurchaseData(range) : await fetchSaleData(range);

        setData({
          complete: tab === '구매 내역' ? res.completePurchases : res.completeSales,
          waiting: tab === '구매 내역' ? res.waitingPurchases : res.waitingSales,
        });
      } catch (error) {
        console.error('거래 내역 불러오기 실패:', error);
      }
    };

    fetchData();
  }, [tab, range]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const renderList = (items, isWaiting) =>
    items.map((item, index) => {
      const isSaleTab = tab === '판매 내역';
      const statusIcon = isWaiting ? loadingIcon : isSaleTab ? redcheckIcon : checkIcon;

      const statusTextColor = isWaiting
        ? 'text-gray-400'
        : isSaleTab
          ? 'text-[#FF4343]'
          : 'text-blue-600';

      const key = `${item.purchaseId || item.saleId}-${isWaiting ? 'w' : 'c'}-${index}`;

      return (
        <div
          key={key}
          className="bg-white rounded-xl px-4 py-3 shadow flex items-center justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center justify-start mt-1 w-12">
              <img
                src={statusIcon}
                alt={isWaiting ? '거래 대기중' : '거래 완료'}
                className="w-6 h-6 object-contain mb-1"
              />
              <span className={`text-[8px] font-medium ${statusTextColor}`}>
                {isWaiting ? '거래 대기중' : '거래 완료'}
              </span>
            </div>

            <div>
              <div className="text-sm font-semibold text-black">
                {item.dataCode === '001' ? 'LTE 데이터' : '5G 데이터'} {item.quantity} GB
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-1 min-w-40">
                <span className="text-left">{formatDate(item.tradeDate)}</span>
                <span className="text-right">{item.pricePerGb.toLocaleString()}원 / 1GB</span>
              </div>
            </div>
          </div>

          {isWaiting && <button className="text-gray-400 text-xl font-bold px-1">×</button>}
        </div>
      );
    });

  return (
    <div>
      <div className="flex items-center mb-6 relative">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
          거래 내역
        </h2>
        <div className="w-6" />
      </div>

      <div className="flex justify-center mb-4 relative">
        <div className="flex bg-gray-100 rounded-full p-1 relative shadow-inner w-[220px]">
          <motion.div
            className={`absolute top-1 bottom-1 rounded-full shadow-md ${
              tab === '구매 내역'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            animate={{ x: tab === '구매 내역' ? '4px' : '110px', width: '104px' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ zIndex: 0 }}
          />
          {tabs.map((label) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className="relative z-10 w-[104px] py-2 text-sm font-medium rounded-full text-center"
            >
              <motion.span
                className={tab === label ? 'text-white' : 'text-gray-600 hover:text-gray-800'}
                animate={{ fontWeight: tab === label ? 600 : 500 }}
              >
                {label}
              </motion.span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mb-4 px-4">
        <span>상품 등록일</span>
        <select
          className="text-sm border px-3 py-1 rounded shadow-sm"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="WEEK">최근 1주일</option>
          <option value="MONTH">최근 1개월</option>
          <option value="YEAR">최근 1년</option>
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {renderList(data.waiting, true)}
        {renderList(data.complete, false)}
      </div>
    </div>
  );
};

export default TradeHistoryPage;
