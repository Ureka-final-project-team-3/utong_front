import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import { deletePendingTrade } from '../../apis/purchaseApi';
import { toast } from 'react-toastify';

const TradeHistoryDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  const tab = location.state?.tab;
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleCancelTrade = async () => {
    const type = tab === '구매 내역' ? 'purchase' : 'sale';
    const id = item.purchaseId || item.saleId;

    try {
      await deletePendingTrade(id, type);
      toast.success('거래가 성공적으로 취소되었습니다.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error('거래 취소에 실패했습니다.');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* 헤더 */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute left-0">
          <BackButton />
        </div>
        <h2 className="text-lg font-bold text-center text-gray-800">
          {' '}
          {tab === '구매 내역' ? '구매 상세 내역' : '판매 상세 내역'}
        </h2>
      </div>

      {/* 거래 요약 정보 */}
      <div className="space-y-3 text-[18px] text-gray-800 px-4 py-6">
        {[
          ['데이터 회선', item.dataCode === '001' ? 'LTE 데이터' : '5G 데이터'],
          [
            '거래 상태',
            {
              canceled: '거래 취소',
              waiting: '거래 대기',
              complete: tab === '구매 내역' ? '구매 완료' : '판매 완료',
              partial: '분할 거래',
            }[item.statusType] ?? item.status,
          ],

          ['요청량', `${item.quantity} GB`],
          ['완료 수량', `${tradedGb} / ${item.quantity} GB`],
          ['남은 수량', `${item.remaining ?? 0} / ${item.quantity} GB`],
          ['전화번호', item.phoneNumber],
          ['1GB 당 가격', item.pricePerGb != null ? `${item.pricePerGb.toLocaleString()}P` : '-'],
          [
            '총 가격',
            item.pricePerGb && item.quantity
              ? `${(item.pricePerGb * item.quantity).toLocaleString()} P`
              : '-',
          ],
          [
            '요청일',
            item.requestDate ? new Date(item.requestDate).toLocaleString() : '날짜 정보 없음',
          ],
        ].map(([label, value], idx) => (
          <div key={idx} className="flex justify-between  pb-1 text-[15px]">
            <span className="text-gray-800">{label}</span>
            <span className={label === '상태' ? 'font-medium text-blue-600' : ''}>{value}</span>
          </div>
        ))}
      </div>

      {/* 상세 체결 내역 타이틀 */}
      <h4 className="mt-10 mb-4 text-[20px] font-bold text-gray-800 relative px-4">
        체결 내역
        <span className="absolute left-4 right-4 bottom-0 border-b border-gray-300"></span>
      </h4>

      {item.contractDto?.length > 0 ? (
        item.contractDto.map((contract, cIndex) => {
          const contractDate = new Date(contract.contractDate);
          const timeDiff = Math.abs(contractDate - tradeDate);
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const timingInfo =
            hoursDiff > 0
              ? `(${hoursDiff}시간 ${minutesDiff}분 후 체결)`
              : minutesDiff > 0
                ? `(${minutesDiff}분 후 체결)`
                : '(즉시 체결)';

          return (
            <div key={cIndex} className="p-4 mb-4">
              <div className="flex">
                <div className="text-gray-800 font-bold mb-2 mr-2">체결 #{cIndex + 1}</div>
                <div className="text-xs italic text-gray-400 mt-1">{timingInfo}</div>
              </div>

              {/* 첫 줄: 체결일시, 수량 */}
              <div className="flex justify-between mb-1">
                <span className="text-gray-500 font-medium text-sm">
                  {contractDate.toLocaleString()}
                </span>
                <span className="text-gray-900 font-medium text-sm">
                  {contract.contractQuantity} GB
                </span>
              </div>

              {/* 둘째 줄: 단가, 금액 */}
              <div className="flex justify-between">
                <span className="text-gray-900 font-medium text-sm">
                  {contract.pricePerUnit.toLocaleString()}원 / GB
                </span>
                <span className="text-gray-900 font-medium text-sm">
                  {(contract.contractQuantity * contract.pricePerUnit).toLocaleString()}원
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-500 py-8">
          아직 체결된 내역이 없습니다.
          {item.remaining > 0 && <p className="mt-1 text-sm">잔여 {item.remaining}GB 대기 중</p>}
        </div>
      )}

      {/* 거래 취소 버튼 */}
      {['waiting', 'partial'].includes(item.statusType) && item.statusType !== 'canceled' && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-6 py-3 mb-5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm font-medium"
          >
            거래 취소하기
          </button>
        </div>
      )}
      {/* 취소 확인 모달 */}

      {isModalOpen && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
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
                onClick={handleCancelTrade}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeHistoryDetailPage;
