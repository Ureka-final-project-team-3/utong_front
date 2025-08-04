import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TradeHistoryDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  const tab = location.state?.tab;

  if (!item) {
    return (
      <div className="p-4 text-center text-red-500">
        잘못된 접근입니다. <br />
        이전 페이지로 돌아가주세요.
      </div>
    );
  }

  const tradedGb = item.quantity - (item.remaining ?? 0);
  const tradeDate = new Date(item.requestDate);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <button className="mb-4 px-3 py-1 bg-gray-200 rounded" onClick={() => navigate(-1)}>
        뒤로가기
      </button>

      <h1 className="text-xl font-bold mb-4">
        {tab === '구매 내역' ? '구매 상세 내역' : '판매 상세 내역'}
      </h1>

      <div className="space-y-2 text-gray-800">
        <p>
          <strong>전화번호:</strong> {item.phoneNumber}
        </p>
        <p>
          <strong>네트워크:</strong> {item.dataCode === '001' ? 'LTE' : '5G'}
        </p>
        <p>
          <strong>요청량:</strong> {item.quantity} GB
        </p>
        <p>
          <strong>거래된 용량:</strong> {tradedGb} GB
        </p>
        <p>
          <strong>남은량:</strong> {item.remaining ?? 0} GB
        </p>
        <p>
          <strong>단가:</strong> {item.pricePerGb != null ? item.pricePerGb.toLocaleString() : '-'}{' '}
          P / 1GB
        </p>
        <p>
          <strong>총 금액:</strong>{' '}
          {item.pricePerGb != null && item.quantity != null
            ? (item.pricePerGb * item.quantity).toLocaleString()
            : '-'}{' '}
          P
        </p>
        <p>
          <strong>요청일:</strong>{' '}
          {item.requestDate ? new Date(item.requestDate).toLocaleString() : '날짜 정보 없음'}
        </p>
        <p>
          <strong>상태:</strong>{' '}
          {{
            canceled: '거래 취소',
            waiting: '거래 대기',
            complete: tab === '구매 내역' ? '구매 완료' : '판매 완료',
            partial: '분할 거래',
          }[item.statusType] ?? item.status}
        </p>
      </div>

      {/* 상세 체결 내역 */}
      <h4 className="mb-4 font-semibold text-lg text-gray-700 mt-8">📋 상세 체결 내역</h4>

      {item.contractDto && item.contractDto.length > 0 ? (
        item.contractDto.map((contract, cIndex) => {
          const contractDate = new Date(contract.contractDate);
          const timeDiff = Math.abs(contractDate - tradeDate);
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          let timingInfo = '';
          if (hoursDiff > 0) {
            timingInfo = `(${hoursDiff}시간 ${minutesDiff}분 후 체결)`;
          } else if (minutesDiff > 0) {
            timingInfo = `(${minutesDiff}분 후 체결)`;
          } else {
            timingInfo = '(즉시 체결)';
          }

          return (
            <div
              key={cIndex}
              className="border border-gray-300 rounded-md p-4 mb-3 bg-white shadow-sm"
            >
              <strong className="block mb-2 text-blue-700">체결 #{cIndex + 1}</strong>
              <div className="text-sm mb-1">📅 체결일시: {contractDate.toLocaleString()}</div>
              <div className="text-sm mb-1">📊 수량: {contract.contractQuantity}GB</div>
              <div className="text-sm mb-1">
                💰 단가: {contract.pricePerUnit.toLocaleString()}원/GB
              </div>
              <div className="text-sm mb-1">
                💵 금액: {(contract.contractQuantity * contract.pricePerUnit).toLocaleString()}원
              </div>
              <div className="text-xs italic text-gray-500">⏱️ {timingInfo}</div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500 py-8">
          📭 아직 체결된 내역이 없습니다.
          {item.remaining > 0 && (
            <>
              <br />
              잔여 {item.remaining}GB 대기 중
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TradeHistoryDetailPage;
