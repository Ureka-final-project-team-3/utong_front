import React, { useEffect, useState } from 'react';
import BuyDataHeader from './components/BuyDataHeader';
import Button from '../../../components/common/Button';

import { mockBuyBids } from '../../LiveChartPage/mock/mockTradeData';
import useUserStore from '@/stores/useUserStore'; // ✅ 사용자 Zustand store
import useTradeStore from '@/stores/tradeStore';
import useModalStore from '@/stores/modalStore'; // 모달 Zustand store

import PointRechargeModal from '../components/PointRechargeModal';
import BuySuccessModal from '../components/BuySuccessModal';
import ReservationModal from '../components/ReservationModal';
import PaymentCompleteModal from '../components/PaymentCompleteModal';

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

  // Zustand 모달 상태 및 함수
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

  // 사용자 요금제 네트워크명 (Zustand에 저장된 dataCode → 네트워크명)
  const userPlanNetwork = codeToNetworkMap[dataCode] || '';

  // 데이터 양, 가격 상태
  const dataOptions = ['1GB', '5GB', '10GB', '20GB'];
  const [selectedDataGB, setSelectedDataGB] = useState(1);
  const [buyPrice, setBuyPrice] = useState('0');

  // 사용자 정보 최초 로딩
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // selectedNetwork 변경 시 dataCode 업데이트 및 평균 가격 초기화
  useEffect(() => {
    const code = networkToDataCodeMap[selectedNetwork] || '002';
    setLocalDataCode(code);

    // 평균가 기반 초기 buyPrice 설정
    const buyBids = mockBuyBids.filter((bid) => bid.dataCode === code);
    const avgPrice = buyBids.length
      ? Math.round(
          buyBids.reduce((sum, b) => sum + b.price * b.quantity, 0) /
            buyBids.reduce((sum, b) => sum + b.quantity, 0) /
            100
        ) * 100
      : 0;

    setBuyPrice(avgPrice.toString());
  }, [selectedNetwork]);

  // 현재 매칭되는 구매 입찰들
  const buyBids = mockBuyBids.filter((bid) => bid.dataCode === localDataCode);

  // 평균가, 최저가 계산
  const avgPrice = buyBids.length
    ? Math.round(
        buyBids.reduce((sum, b) => sum + b.price * b.quantity, 0) /
          buyBids.reduce((sum, b) => sum + b.quantity, 0) /
          100
      ) * 100
    : 0;
  const minPrice = buyBids.length ? Math.min(...buyBids.map((b) => b.price)) : 0;

  const buyPriceNum = Number(buyPrice) || 0;

  // 데이터 GB 입력 처리
  const handleGBInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const numVal = val === '' ? 0 : Math.max(0, Number(val));
      setSelectedDataGB(numVal);
    }
  };

  // 버튼 클릭 시 GB 추가
  const addDataGB = (gbString) => {
    const gbNum = Number(gbString.replace('GB', ''));
    setSelectedDataGB((prev) => (Number(prev) || 0) + gbNum);
  };

  // 구매하기 버튼 클릭 처리
  const handleBuyClick = () => {
    const selectedQty = Number(selectedDataGB) || 0;
    const totalPrice = buyPriceNum * selectedQty;
    const matchedBids = buyBids.filter((bid) => bid.price <= buyPriceNum);
    const matchedQuantity = matchedBids.reduce((sum, b) => sum + b.quantity, 0);

    // 사용 요금제 다르면 클릭 자체 못하게 disabled 처리 중이라 필요 없지만, 안전하게 한 번 더 체크 가능
    if (userPlanNetwork !== selectedNetwork) {
      return;
    }

    if (point < totalPrice) {
      openModal('showRechargeModal');
      return;
    }

    if (buyPriceNum < minPrice) {
      openModal('showReservationModal');
      return;
    }

    if (selectedQty > matchedQuantity) {
      openModal('showPaymentCompleteModal');
      setTimeout(() => closeModal('showPaymentCompleteModal'), 2000);
      return;
    }

    openModal('showSuccessModal');
    setTimeout(() => closeModal('showSuccessModal'), 2000);
  };

  // 요금제 일치 여부
  const isUserPlanMatches = userPlanNetwork === selectedNetwork;

  // 버튼 활성화 조건
  const isButtonEnabled = buyPriceNum > 0 && (Number(selectedDataGB) || 0) > 0 && isUserPlanMatches;

  return (
    <div>
      <BuyDataHeader />

      {/* 모달들 */}
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

      {/* 사용자 정보 영역 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 space-y-2 text-[13px] text-[#5D5D5D]">
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

        <div className="flex-1 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-[#4B4B4B] text-[14px]">평균가</span>
            <span className="text-[#2C2C2C] text-[15px] font-medium">
              {avgPrice.toLocaleString()}{' '}
              <span className="text-[#565656] text-[13px] font-bold">원</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D5D5D]">최저가</span>
            <span className="text-[#2C2C2C] text-[15px]">
              {minPrice.toLocaleString()} <span className="text-[#565656] text-[13px]">원</span>
            </span>
          </div>
        </div>
      </div>

      {/* 가격 입력 */}
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

      {/* 데이터 양 입력 */}
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

      {/* 총 가격 */}
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
