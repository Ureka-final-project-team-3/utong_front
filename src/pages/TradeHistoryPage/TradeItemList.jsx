import React, { useState } from 'react';
import loadingIcon from '@/assets/image/loading.png';
import checkIcon from '@/assets/image/check.png';
import redcheckIcon from '@/assets/icon/redcheck.svg';
import { deletePendingTrade } from '@/apis/purchaseApi';
import { motion, AnimatePresence } from 'framer-motion'; // 👈 추가
const TradeItemList = ({ tab, completeList, waitingList }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${String(date.getDate()).padStart(2, '0')}일`;
  };

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

  const sortedGroups = Object.entries(grouped).sort((a, b) => {
    const dateA = new Date(a[0].replace('월 ', '/').replace('일', ''));
    const dateB = new Date(b[0].replace('월 ', '/').replace('일', ''));
    return dateB - dateA;
  });

  const handleCancel = async (id) => {
    const type = tab === '구매 내역' ? 'purchase' : 'sale';
    try {
      await deletePendingTrade(id, type);
      alert('거래가 취소되었습니다.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('거래 취소 실패');
    }
  };

  return (
    <>
      {sortedGroups.map(([date, list]) => (
        <div key={date}>
          <p className="text-xl font-bold text-[#444] mt-6 mb-3">{date}</p>
          <div className="flex flex-col gap-4">
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
                const isExpanded = expandedIndex === key;

                return (
                  <div
                    key={key}
                    className="py-2 px-2 rounded-md cursor-pointer"
                    onClick={() => setExpandedIndex(isExpanded ? null : key)}
                  >
                    <div className="flex justify-between items-start text-sm">
                      <div className="flex items-center gap-2 w-[40%]">
                        <img src={icon} alt="status" className="w-6 h-6" />
                        <span className={`${statusColor} font-bold`}>{status}</span>
                      </div>
                      <span className="text-gray-700 font-semibold">
                        {item.dataCode === '001' ? 'LTE 데이터' : '5G 데이터'}
                      </span>
                      <div className="flex flex-col text-right text-base text-gray-600 w-[20%]">
                        <span>{(item.pricePerGb * item.quantity).toLocaleString()}P</span>
                      </div>
                    </div>

                    {/* 확장 영역 */}
                    {/* 확장 영역 애니메이션 */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="mt-2 pl-8 text-sm text-gray-700 overflow-hidden border-b border-gray-300"
                        >
                          {/* 전화번호 + 단가 한 줄 */}
                          <div className="flex justify-between items-center mb-3 text-[13px]">
                            <span className="font-medium">{item.phoneNumber}</span>
                            <span className="text-gray-600 font-normal">
                              {item.quantity}GB / {item.pricePerGb.toLocaleString()}P
                            </span>
                          </div>

                          {/* 거래 취소 버튼 가운데 정렬 */}
                          {item.isWaiting && (
                            <div className="flex justify-center">
                              <button
                                className="text-base px-4 py-1 border border-gray-400 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 mb-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancel(item.purchaseId || item.saleId);
                                }}
                              >
                                거래 취소하기
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </>
  );
};

export default TradeItemList;
