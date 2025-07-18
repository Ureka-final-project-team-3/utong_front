// src/pages/SellDataPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SellDataHeader from './components/SellDataHeader';
import Button from '../../../components/common/Button';
import { mockSellBids } from '../../LiveChartPage/mock/mockTradeData';
import SellSuccessModal from '../components/SellSuccessModal';

import useTradeStore from '@/stores/tradeStore';
import useUserStore from '@/stores/useUserStore';
import { postSellOrder } from '@/apis/dataTradeApi';

const networkToDataCodeMap = {
  LTE: '001',
  '5G': '002',
};

const codeToNetworkMap = {
  '001': 'LTE',
  '002': '5G',
};

const SellDataPage = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const {
    name: userName,
    remainingData: data,
    mileage: point,
    fetchUserData,
    dataCode,
  } = useUserStore();

  const [localDataCode, setLocalDataCode] = useState(
    networkToDataCodeMap[selectedNetwork] || '002'
  );
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [isBlockingInput, setIsBlockingInput] = useState(false);

  const ableData = data / 10; // 판매 가능 데이터(GB 기준)

  useEffect(() => {
    console.log('selectedNetwork (zustand):', selectedNetwork);
    setLocalDataCode(networkToDataCodeMap[selectedNetwork] || '002');
  }, [selectedNetwork]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    console.log('유저 정보 업데이트:', {
      userName,
      dataCode,
      data,
      point,
    });
  }, [userName, dataCode, data, point]);

  const sellBids = mockSellBids.filter((bid) => bid.dataCode === localDataCode);

  const avgPrice = sellBids.length
    ? Math.round(
        sellBids.reduce((sum, b) => sum + b.price * b.quantity, 0) /
          sellBids.reduce((sum, b) => sum + b.quantity, 0) /
          100
      ) * 100
    : 0;

  const maxPrice = sellBids.length ? Math.max(...sellBids.map((b) => b.price)) : 0;

  const [price, setPrice] = useState(avgPrice.toString());
  const dataOptions = ['1GB', '2GB', '3GB', '5GB'];
  const [dataAmount, setDataAmount] = useState(1);

  const priceNum = Number(price) || 0;
  const minPrice = Math.floor(avgPrice * 0.7);
  const maxPriceAllowed = Math.ceil(avgPrice * 1.3);

  const totalPrice = priceNum * dataAmount;
  const totalFee = Math.floor(totalPrice * 0.025);
  const totalAfterPoint = totalPrice - totalFee;

  const isPriceValid = priceNum >= minPrice && priceNum <= maxPriceAllowed;
  const isDataValid = dataAmount > 0 && dataAmount <= ableData;

  const [hasWarned, setHasWarned] = useState(false);

  // userPlanNetwork를 useMemo로 최신 상태 반영 및 소문자 비교용 변수 생성
  const userPlanNetwork = useMemo(() => codeToNetworkMap[dataCode] || '', [dataCode]);
  const normalizedUserPlanNetwork = userPlanNetwork.toLowerCase();
  const normalizedSelectedNetwork = selectedNetwork.toLowerCase();

  useEffect(() => {
    console.log('userPlanNetwork:', userPlanNetwork);
    console.log('normalizedUserPlanNetwork:', normalizedUserPlanNetwork);
    console.log('normalizedSelectedNetwork:', normalizedSelectedNetwork);
  }, [userPlanNetwork, normalizedUserPlanNetwork, normalizedSelectedNetwork]);

  useEffect(() => {
    if (!isPriceValid && price.length > 0 && !hasWarned) {
      toast.error(
        `가격은 ${minPrice.toLocaleString()}원 이상 ${maxPriceAllowed.toLocaleString()}원 이하만 가능합니다.`,
        { autoClose: 3000 }
      );
      setHasWarned(true);
    }
    if (isPriceValid) setHasWarned(false);
  }, [price, isPriceValid, hasWarned, minPrice, maxPriceAllowed]);

  useEffect(() => {
    if (dataAmount > ableData && data !== 0) {
      toast.error(`보유 데이터(${ableData}GB)보다 많은 양을 판매할 수 없어요.`, {
        autoClose: 3000,
        onOpen: () => setIsBlockingInput(true),
        onClose: () => setIsBlockingInput(false),
      });
    }
  }, [dataAmount, ableData, data]);

  useEffect(() => {
    toast.info('거래중개 등 제반 서비스 이용료가 포함됩니다.', {
      autoClose: 3000,
      position: 'top-center',
    });
  }, []);

  useEffect(() => {
    console.log('가격 유효성:', isPriceValid, '가격:', price);
    console.log('데이터 유효성:', isDataValid, '판매 데이터 양:', dataAmount);
    console.log('판매 가능 데이터:', ableData);
  }, [isPriceValid, price, isDataValid, dataAmount, ableData]);

  const handleSellClick = async () => {
    if (!isPriceValid || !isDataValid || normalizedUserPlanNetwork !== normalizedSelectedNetwork)
      return;

    const payload = {
      price: priceNum,
      dataAmount,
      dataCode: localDataCode,
    };

    try {
      const res = await postSellOrder(payload);

      if (res && res.result) {
        setModalStatus(res.result);
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          setModalStatus(null);
        }, 5000);
      } else {
        setModalStatus(null);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 3000);
      }

      fetchUserData();
    } catch (err) {
      console.error('판매 등록 실패:', err);
      setModalStatus(null);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  const handleSelectData = (option) => {
    const val = Number(option.replace('GB', ''));
    setDataAmount((prev) => prev + val);
  };

  const isButtonEnabled =
    isPriceValid &&
    isDataValid &&
    dataAmount <= ableData &&
    normalizedUserPlanNetwork === normalizedSelectedNetwork;

  return (
    <div style={{ position: 'relative' }}>
      <SellDataHeader />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 400,
          zIndex: 9999,
          pointerEvents: 'auto',
        }}
      />

      <SellSuccessModal
        show={showModal}
        statusKey={modalStatus}
        onClose={() => setShowModal(false)}
      />

      <div className="mt-6 text-[20px] font-bold text-[#2C2C2C]">{userName}님</div>
      <div className="text-[#565656] text-[12px] text-right">(1GB)</div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 space-y-2 text-[13px] text-[#5D5D5D]">
          <div className="flex justify-between">
            <span>보유 포인트</span>
            <span className="text-[#2C2C2C]">
              {point} <span className="text-[#565656]">P</span>
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
              {avgPrice.toLocaleString()}
              <span className="text-[#565656] text-[13px] font-bold"> 원</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D5D5D]">최대가</span>
            <span className="text-[#2C2C2C] text-[15px]">
              {maxPrice.toLocaleString()}
              <span className="text-[#565656] text-[13px]"> 원</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2">판매할 가격</div>
        <div className="flex justify-end items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={price}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setPrice(value);
              }
            }}
            className="text-[20px] font-medium text-right w-full bg-transparent outline-none"
          />
          <span className="ml-1 text-[20px] text-[#2C2C2C]">P</span>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-[#FF4343] text-center">
        현재 평균 가격에서 ±30% 범위 안에서만 거래할 수 있어요.
      </div>

      <div className="mt-4 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2 flex justify-between">
          <div>데이터</div>
          <div>판매가능 데이터 : {ableData}GB</div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] text-[#B1B1B1] w-full">얼마나 판매할까요?</span>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={dataAmount}
              disabled={isBlockingInput}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setDataAmount(Number(value));
                }
              }}
              className="text-[20px] font-medium text-right w-full bg-transparent outline-none"
            />
            <span className="ml-1 text-[20px] text-[#2C2C2C]">GB</span>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {dataOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleSelectData(option)}
              disabled={isBlockingInput}
              className="w-[60px] h-[25px] rounded-[10px] border border-[#B1B1B1] bg-[#F6F7FB] text-[#777] text-[12px] font-medium flex items-center justify-center
                hover:border-[#FF4343] hover:bg-[#FFEEEE] hover:text-[#FF4343]"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between text-[16px] text-[#777]">
          <span>수수료 2.5%</span>
          <span className="text-[#2C2C2C] font-medium">{totalFee.toLocaleString()} P</span>
        </div>
        <div className="flex justify-between text-[16px] text-[#5D5D5D]">
          <span>총 판매 포인트</span>
          <span className="text-[20px] text-[#2C2C2C] font-medium">
            {totalAfterPoint.toLocaleString()} P
          </span>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button
          disabled={!isButtonEnabled}
          onClick={handleSellClick}
          className={`w-full ${
            isButtonEnabled ? 'bg-[#FF4343] hover:bg-[#e63a3a]' : 'bg-[#949494] cursor-not-allowed'
          }`}
        >
          {normalizedUserPlanNetwork === normalizedSelectedNetwork
            ? '판매하기'
            : '사용 요금제가 다릅니다'}
        </Button>
      </div>
    </div>
  );
};

export default SellDataPage;
