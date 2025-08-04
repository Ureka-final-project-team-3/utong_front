import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← 추가
import { deletePendingTrade } from '@/apis/purchaseApi';
import { motion, AnimatePresence } from 'framer-motion';

const TradeItemList = ({ tab, completeList, partialList, waitingList, canceledList }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate(); // ← 추가

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${String(date.getDate()).padStart(2, '0')}일`;
  };

  const allItems = [
    ...waitingList.map((i) => ({ ...i, statusType: 'waiting', isWaiting: true })),
    ...canceledList.map((i) => ({ ...i, statusType: 'canceled', isWaiting: true })),
    ...completeList.map((i) => ({ ...i, statusType: 'complete', isWaiting: false })),
    ...partialList.map((i) => ({ ...i, statusType: 'partial', isWaiting: false })),
  ];

  const grouped = allItems.reduce((acc, item) => {
    const date = formatDate(item.requestDate);
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort((a, b) => {
    const dateA = new Date(a[0].replace('월 ', '/').replace('일', ''));
    const dateB = new Date(b[0].replace('월 ', '/').replace('일', ''));
    return dateB - dateA;
  });

  const handleCancelConfirm = async () => {
    const type = tab === '구매 내역' ? 'purchase' : 'sale';
    try {
      await deletePendingTrade(selectedId, type);
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('거래 취소 실패');
    }
  };

  // 상세 페이지 이동 함수
  const onItemClick = (item) => {
    const id = item.purchaseId || item.saleId;
    navigate(`/tradehistory/detail/${id}`, { state: { item, tab } });
  };

  return (
    <>
      {allItems.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">거래 내역이 없습니다.</div>
      ) : (
        sortedGroups.map(([date, list]) => (
          <div key={date}>
            <p className="text-[16px] font-bold text-gray-600 mt-6 mb-3">{date}</p>
            <div className="flex flex-col gap-4">
              {list
                .sort((a, b) => (a.isWaiting === b.isWaiting ? 0 : a.isWaiting ? -1 : 1))
                .map((item, idx) => {
                  let status;
                  let statusColor;

                  if (item.statusType === 'canceled') {
                    status = '거래 취소';
                    statusColor = 'text-[#2C2C2C]';
                  } else if (item.statusType === 'waiting') {
                    status = '거래 대기';
                    statusColor = 'text-gray-400';
                  } else if (item.statusType === 'partial') {
                    status = '분할 거래';
                    statusColor = 'text-[#5732A1]';
                  } else if (tab === '구매 내역') {
                    status = '구매 완료';
                    statusColor = 'text-blue-600';
                  } else {
                    status = '판매 완료';
                    statusColor = 'text-[#FF4343]';
                  }

                  const key = `${item.purchaseId || item.saleId}-${idx}`;
                  const isExpanded = expandedIndex === key;

                  const tradedGb = item.quantity - (item.remaining ?? 0);

                  return (
                    <div
                      key={key}
                      className="py-2 px-2 rounded-md cursor-pointer"
                      onClick={() => onItemClick(item)} // ← 수정: 클릭 시 상세페이지로 이동
                    >
                      <div className="flex justify-between items-center text-gray-800">
                        <div className={`${statusColor} font-bold`}>{status}</div>
                        <div>{item.dataCode === '001' ? 'LTE' : '5G'}</div>
                        <div>
                          {tradedGb}/{item.quantity}GB
                        </div>
                        <div>{item.pricePerGb.toLocaleString()}P/1GB</div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="mt-2 pl-8 text-sm text-gray-700 overflow-hidden border-b border-gray-300"
                            onClick={(e) => e.stopPropagation()} // 내부 클릭 이벤트 버블링 방지
                          >
                            <div className="flex justify-between items-center mb-3 text-[13px]">
                              <span className="font-medium">{item.phoneNumber}</span>
                              <span className="text-gray-600 font-normal">
                                {item.quantity}GB / {item.pricePerGb.toLocaleString()}P
                              </span>
                            </div>

                            {item.isWaiting && item.statusType !== 'canceled' && (
                              <div className="flex justify-center">
                                <button
                                  className="text-base px-4 py-1 border border-gray-400 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 mb-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(item.purchaseId || item.saleId);
                                    setIsModalOpen(true);
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
        ))
      )}

      {isModalOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-72 p-6 rounded-xl shadow-md text-center animate-fadeIn">
            <p className="text-sm text-gray-800 mb-4">
              <span className="font-semibold">거래 취소</span>
              <br />
              해당 거래는 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-600 text-sm"
              >
                취소
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TradeItemList;
