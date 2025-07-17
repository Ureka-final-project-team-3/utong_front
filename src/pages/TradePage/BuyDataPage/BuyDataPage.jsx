import React, { useEffect, useState } from 'react';
import BuyDataHeader from './components/BuyDataHeader';
import Button from '../../../components/common/Button';

import { mockBuyBids } from '../../LiveChartPage/mock/mockTradeData';
import useUserStore from '@/stores/useUserStore'; // ✅ 사용자 Zustand store
import useTradeStore from '@/stores/tradeStore';

import PointRechargeModal from '../components/PointRechargeModal';
import BuySuccessModal from '../components/BuySuccessModal';
import ReservationModal from '../components/ReservationModal';
import PaymentCompleteModal from '../components/PaymentCompleteModal';

const networkToDataCodeMap = {
  LTE: '001',
  '5G': '002',
};

const BuyDataPage = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const { name: userName, remainingData: data, mileage: point, fetchUserData } = useUserStore(); // ✅ Zustand에서 유저 정보 가져오기

  const [dataCode, setDataCode] = useState(networkToDataCodeMap[selectedNetwork] || '002');

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showPaymentCompleteModal, setShowPaymentCompleteModal] = useState(false);

  // ✅ 처음 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    setDataCode(networkToDataCodeMap[selectedNetwork] || '002');
  }, [selectedNetwork]);

  const buyBids = mockBuyBids.filter((bid) => bid.dataCode === dataCode);

  const avgPrice = buyBids.length
    ? Math.round(
        buyBids.reduce((sum, b) => sum + b.price * b.quantity, 0) /
          buyBids.reduce((sum, b) => sum + b.quantity, 0) /
          100
      ) * 100
    : 0;

  const minPrice = buyBids.length ? Math.min(...buyBids.map((b) => b.price)) : 0;

  const dataOptions = ['1GB', '5GB', '10GB', '20GB'];
  const [selectedDataGB, setSelectedDataGB] = useState(1);
  const [buyPrice, setBuyPrice] = useState(avgPrice.toString());

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

  const handleBuyClick = () => {
    const selectedQty = Number(selectedDataGB) || 0;
    const totalPrice = buyPriceNum * selectedQty;
    const matchedBids = buyBids.filter((bid) => bid.price <= buyPriceNum);
    const matchedQuantity = matchedBids.reduce((sum, b) => sum + b.quantity, 0);

    if (point < totalPrice) {
      setShowRechargeModal(true);
      return;
    }

    if (buyPriceNum < minPrice) {
      setShowReservationModal(true);
      return;
    }

    if (selectedQty > matchedQuantity) {
      setShowPaymentCompleteModal(true);
      setTimeout(() => setShowPaymentCompleteModal(false), 2000);
      return;
    }

    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  return (
    <div>
      <BuyDataHeader />

      {/* 모달들 */}
      <PointRechargeModal show={showRechargeModal} onClose={() => setShowRechargeModal(false)} />
      <BuySuccessModal show={showSuccessModal} />
      {showReservationModal && (
        <ReservationModal onConfirm={() => setShowReservationModal(false)} />
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
          className="bg-[#386DEE] hover:bg-[#2f5bd9] w-full"
          disabled={buyPriceNum <= 0 || (Number(selectedDataGB) || 0) <= 0}
        >
          구매하기
        </Button>
      </div>
    </div>
  );
};

export default BuyDataPage;
