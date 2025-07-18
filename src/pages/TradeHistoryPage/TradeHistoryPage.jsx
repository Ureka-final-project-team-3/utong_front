import React, { useState } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import loadingIcon from '@/assets/image/loading.png';
import checkIcon from '@/assets/image/check.png';
import { motion } from 'framer-motion';

motion.span = motion;

const tabs = ['구매 내역', '판매 내역'];
const dummyData = [
  {
    id: 1,
    status: '거래 대기중',
    product: '5G 데이터 10 GB',
    date: '2025.07.01',
    pricePerGB: '1200원 / 1GB',
  },
  {
    id: 2,
    status: '거래 완료',
    product: '5G 데이터 6 GB',
    date: '2025.06.25',
    pricePerGB: '1100원 / 1GB',
  },
  {
    id: 3,
    status: '거래 대기중',
    product: '5G 데이터 10 GB',
    date: '2025.07.01',
    pricePerGB: '1200원 / 1GB',
  },
  {
    id: 4,
    status: '거래 완료',
    product: '5G 데이터 6 GB',
    date: '2025.06.25',
    pricePerGB: '1100원 / 1GB',
  },
];

const TradeHistoryPage = () => {
  const [tab, setTab] = useState('구매 내역');

  return (
    <div>
      {/* 헤더 */}
      <div className="flex items-center mb-6 relative">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-bold">
          거래 내역
        </h2>
        <div className="w-6" />
      </div>

      {/* 탭 */}

      <div className="flex justify-center mb-4 relative">
        <div className="flex bg-gray-100 rounded-full p-1 relative shadow-inner w-[220px]">
          {/* 슬라이딩 배경 */}
          <motion.div
            className={`absolute top-1 bottom-1 rounded-full shadow-md ${
              tab === '구매 내역'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            animate={{
              x: tab === '구매 내역' ? '4px' : '110px',
              width: '104px',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
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
                animate={{
                  fontWeight: tab === label ? 600 : 500,
                }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4 px-4">
        <span>상품 등록일</span>
        <select className="text-sm border px-3 py-1 rounded shadow-sm">
          <option>최근 1주일</option>
          <option>최근 1개월</option>
        </select>
      </div>

      {/* 거래 리스트 */}
      <div className="flex flex-col gap-3 ">
        {dummyData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl px-4 py-3 shadow flex items-center justify-between"
          >
            {/* 왼쪽 정보 */}
            <div className="flex items-start gap-4">
              {/* 상태 아이콘 + 텍스트 수직 정렬 */}
              <div className="flex flex-col items-center justify-start mt-1 w-12">
                <img
                  src={item.status === '거래 완료' ? checkIcon : loadingIcon}
                  alt={item.status}
                  className="w-6 h-6 object-contain mb-1"
                />
                <span
                  className={`text-[8px] font-medium ${
                    item.status === '거래 완료' ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* 거래 상세 정보 */}
              <div>
                <div className="text-sm font-semibold text-black">{item.product}</div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-1 min-w-40">
                  <span className="text-left">{item.date}</span>
                  <span className="text-right">{item.pricePerGB}</span>
                </div>
              </div>
            </div>

            {/* 우측 버튼 */}
            {item.status === '거래 대기중' && (
              <button className="text-gray-400 text-xl font-bold px-1">×</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistoryPage;
