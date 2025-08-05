import React from 'react';
import { useNavigate } from 'react-router-dom';

const TradeItemList = ({ tab, completeList, partialList, waitingList, canceledList }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${String(date.getDate()).padStart(2, '0')}일`;
  };

  const allItems = [
    ...waitingList.map((i) => ({ ...i, statusType: 'waiting', isWaiting: true })),
    ...completeList.map((i) => ({ ...i, statusType: 'complete', isWaiting: false })),
    ...partialList.map((i) => ({ ...i, statusType: 'partial', isWaiting: false })),
    ...canceledList.map((i) => ({ ...i, statusType: 'canceled', isWaiting: false })),
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

                  if (item.statusType === 'waiting') {
                    status = '거래 대기';
                    statusColor = 'text-gray-400';
                  } else if (item.statusType === 'partial') {
                    status = '분할 거래';
                    statusColor = 'text-[#5732A1]';
                  } else if (item.statusType === 'canceled') {
                    status = '거래 취소';
                    statusColor = 'text-gray-400';
                  } else if (tab === '구매 내역') {
                    status = '구매 완료';
                    statusColor = 'text-blue-600';
                  } else {
                    status = '판매 완료';
                    statusColor = 'text-[#FF4343]';
                  }

                  const tradedGb = item.quantity - (item.remaining ?? 0);

                  return (
                    <div
                      key={`${item.purchaseId || item.saleId}-${idx}`}
                      className="py-2 px-2 rounded-md cursor-pointer"
                      onClick={() => onItemClick(item)}
                    >
                      <div className="flex justify-between items-center text-gray-800">
                        <div className={`${statusColor} font-bold`}>{status}</div>
                        <div>{item.dataCode === '001' ? 'LTE' : '5G'}</div>
                        <div>
                          {tradedGb}/{item.quantity}GB
                        </div>
                        <div>{item.pricePerGb.toLocaleString()}P/1GB</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default TradeItemList;
