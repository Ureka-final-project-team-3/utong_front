import React, { useEffect, useState } from 'react';
import BuyDataHeader from './components/BuyDataHeader';
import Button from '../../../components/common/Button';

import { mockSellBids } from '../../LiveChartPage/mock/mockTradeData'; // 판매 매물 데이터
import useUserStore from '@/stores/useUserStore'; // ✅ 사용자 Zustand store
import useTradeStore from '@/stores/tradeStore';
import useModalStore from '@/stores/modalStore'; // 모달 Zustand store

import PointRechargeModal from '../components/PointRechargeModal';
import BuySuccessModal from '../components/BuySuccessModal';
import ReservationModal from '../components/ReservationModal';
import PaymentCompleteModal from '../components/PaymentCompleteModal';

import { postBuyOrder } from '@/apis/dataTradeApi'; // 구매 주문 API import (경로 맞게 수정)

const networkToDataCodeMap = {
  LTE: '001',
  '5G': '002',
};

const codeToNetworkMap = {
  '001': 'LTE',
  '002': '5G',
};

const BuyDataPage = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const {
    name: userName,
    remainingData: data,
    mileage: point,
    fetchUserData,
    dataCode,
  } = useUserStore();

  const {
    showRechargeModal,
    showSuccessModal,
    showReservationModal,
    showPaymentCompleteModal,
    openModal,
    closeModal,
  } = useModalStore();

  const [localDataCode, setLocalDataCode] = useState(
    networkToDataCodeMap[selectedNetwork] || '002'
  );

  const userPlanNetwork = codeToNetworkMap[dataCode] || '';

  const dataOptions = ['1GB', '2GB', '3GB', '5GB'];
  const [selectedDataGB, setSelectedDataGB] = useState(1);
  const [buyPrice, setBuyPrice] = useState('0');

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    const code = networkToDataCodeMap[selectedNetwork] || '002';
    setLocalDataCode(code);

    // 판매 매물 필터링
    const sellBids = mockSellBids.filter((bid) => bid.dataCode === code);

    // 판매 매물 최저가 계산 (최저가가 없으면 0)
    const minSellPrice = sellBids.length ? Math.min(...sellBids.map((b) => b.price)) : 0;

    setBuyPrice(minSellPrice.toString());
  }, [selectedNetwork]);

  // 판매 매물 필터링
  const sellBids = mockSellBids.filter((bid) => bid.dataCode === localDataCode);

  // 평균가 계산 (수량 가중 평균)
  const avgPrice = sellBids.length
    ? Math.round(
        sellBids.reduce((sum, b) => sum + b.price * b.quantity, 0) /
          sellBids.reduce((sum, b) => sum + b.quantity, 0) /
          100
      ) * 100
    : 0;

  // 최저가 계산
  const minPrice = sellBids.length ? Math.min(...sellBids.map((b) => b.price)) : 0;

  const buyPriceNum = Number(buyPrice) || 0;

  const handleGBInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const numVal = val === '' ? 0 : Math.max(0, Number(val));
      setSelectedDataGB(numVal);
    }
  };

  const addDataGB = (gbString) => {
    const gbNum = Number(gbString.replace('GB', ''));
    setSelectedDataGB((prev) => (Number(prev) || 0) + gbNum);
  };

  const handleBuyClick = async () => {
    try {
      const selectedQty = Number(selectedDataGB) || 0;
      const totalPrice = buyPriceNum * selectedQty;

      if (userPlanNetwork !== selectedNetwork) {
        console.log('[구매 실패] 요금제 불일치', { userPlanNetwork, selectedNetwork });
        return;
      }

      if (point < totalPrice) {
        console.log('[구매 실패] 포인트 부족', { point, totalPrice });
        openModal('showRechargeModal');
        return;
      }

      const payload = {
        price: buyPriceNum,
        dataAmount: selectedQty,
        dataCode: localDataCode,
      };

      const response = await postBuyOrder(payload);

      console.log('[API 응답]', response);

      switch (response.result) {
        case 'ALL_COMPLETE':
          openModal('showSuccessModal');
          setTimeout(() => closeModal('showSuccessModal'), 2000);
          break;
        case 'PART_COMPLETE':
          openModal('showPaymentCompleteModal');
          setTimeout(() => closeModal('showPaymentCompleteModal'), 2000);
          break;
        case 'WAITING':
          openModal('showReservationModal');
          break;
        case 'INSUFFICIENT_POINT':
          openModal('showRechargeModal');
          break;
        case 'NEED_DEFAULT_LINE':
          alert('기본 회선을 설정해 주세요.');
          break;
        case 'EXIST_SALE_REQUEST':
          alert('이미 판매 요청이 존재합니다.');
          break;
        default:
          alert('알 수 없는 오류가 발생했습니다.');
      }

      fetchUserData();
    } catch (error) {
      console.error('[구매 요청 오류]', error);
      alert('구매 요청 중 오류가 발생했습니다.');
    }
  };

  const isUserPlanMatches = userPlanNetwork === selectedNetwork;
  const isButtonEnabled = buyPriceNum > 0 && (Number(selectedDataGB) || 0) > 0 && isUserPlanMatches;

  return (
    <div>
      <BuyDataHeader />

      <PointRechargeModal
        show={showRechargeModal}
        onClose={() => closeModal('showRechargeModal')}
      />
      <BuySuccessModal show={showSuccessModal} onClose={() => closeModal('showSuccessModal')} />
      {showReservationModal && (
        <ReservationModal onConfirm={() => closeModal('showReservationModal')} />
      )}
      {showPaymentCompleteModal && <PaymentCompleteModal point={point} />}

      <div className="mt-6 text-[20px] font-bold text-[#2C2C2C]">{userName}님</div>
      <div className="text-[#565656] text-[12px] text-right">(1GB)</div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 space-y-2 text-[14px] text-[#5D5D5D]">
          <div className="flex justify-between">
            <span>보유 포인트</span>
            <span className="text-[#2C2C2C]">
              {point.toLocaleString()} <span className="text-[#565656]">P</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span>보유 데이터</span>
            <span className="text-[#2C2C2C]">
              {data} <span className="text-[#565656]">GB</span>
            </span>
          </div>
        </div>

        <div className="w-px h-[35px] bg-[#D9D9D9]" />

        <div className="flex-1 space-y-2 text-[14px]">
          <div className="flex justify-between">
            <span className="text-[#4B4B4B]">판매 평균가</span>
            <span className="text-[#2C2C2C] font-medium">
              {avgPrice.toLocaleString()}
              <span className="text-[#565656]"> 원</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D5D5D]">판매 최저가</span>
            <span className="text-[#2C2C2C]">
              {minPrice.toLocaleString()} <span className="text-[#565656]">원</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2">구매할 가격</div>
        <div className="flex justify-end items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={buyPrice}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val)) {
                setBuyPrice(val);
              }
            }}
            className="text-[20px] font-medium text-right w-full bg-transparent outline-none"
          />
          <span className="ml-1 text-[20px] text-[#2C2C2C]">P</span>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-[#386DEE] text-center">
        최저가보다 낮은 금액은 구매대기됩니다.
      </div>

      <div className="mt-4 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2">데이터</div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] text-[#B1B1B1] w-full">얼마나 구매할까요?</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={selectedDataGB}
            onChange={handleGBInputChange}
            className="text-[20px] font-medium text-right w-full bg-transparent outline-none"
          />
          <span className="ml-1 text-[13px] text-[#565656]">GB</span>
        </div>
        <div className="flex gap-2 mt-2">
          {dataOptions.map((option) => (
            <button
              key={option}
              onClick={() => addDataGB(option)}
              className="w-[60px] h-[25px] rounded-[10px] border border-[#B1B1B1] bg-[#F6F7FB] text-[#777] text-[12px] font-medium flex items-center justify-center
              hover:border-[#386DEE] hover:bg-[#E6EEFF] hover:text-[#386DEE]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-[10px] text-[#386DEE] text-center">
        최저가의 모든 데이터 양보다 수량이 작으면 구매대기됩니다.
      </div>

      <div className="mt-6 border-t border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between text-[16px] text-[#5D5D5D]">
          <span>총 결제 포인트</span>
          <span className="text-[20px] text-[#2C2C2C] font-medium">
            {(buyPriceNum * (Number(selectedDataGB) || 0)).toLocaleString()} P
          </span>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button
          onClick={handleBuyClick}
          className={`w-full ${
            isButtonEnabled ? 'bg-[#386DEE] hover:bg-[#2f5bd9]' : 'bg-[#949494] cursor-not-allowed'
          }`}
          disabled={!isButtonEnabled}
        >
          {isUserPlanMatches ? '구매하기' : '사용 요금제가 다릅니다'}
        </Button>
      </div>
    </div>
  );
};

export default BuyDataPage;
