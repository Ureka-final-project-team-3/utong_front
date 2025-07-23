import React, { useState, useEffect, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SellDataHeader from './components/SellDataHeader';
import Button from '../../../components/common/Button';
import SellSuccessModal from '../components/SellSuccessModal';
import SyncLoading from '@/components/Loading/SyncLoading';

import useTradeStore from '@/stores/tradeStore';
import useUserStore from '@/stores/useUserStore';
import { postSellOrder } from '@/apis/dataTradeApi';
import useOrderQueue from '@/hooks/useOrderQueue';

import questionIcon from '@/assets/icon/question.svg';

// 가격 범위 상수 import
import { MIN_PRICE_FLOOR_BY_NETWORK, MAX_PRICE_CEIL_BY_NETWORK } from '../constants/priceRange';

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
    canSale,
  } = useUserStore();

  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const [isBlockingInput, setIsBlockingInput] = useState(false);

  const localDataCode = networkToDataCodeMap[selectedNetwork] || '002';

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      await fetchUserData();
      setIsLoading(false);

      toast.info('거래중개 등 제반 서비스 이용료가 포함됩니다.', {
        autoClose: 3000,
        position: 'top-center',
        toastId: 'welcome-toast',
      });
    };
    loadUserData();
  }, [fetchUserData]);

  const { queueData, isLoading: isQueueLoading } = useOrderQueue(localDataCode);

  const buyBids = useMemo(() => {
    if (!queueData.buyOrderQuantity) return [];
    return Object.entries(queueData.buyOrderQuantity).map(([price, quantity]) => ({
      price: Number(price),
      quantity: Number(quantity),
    }));
  }, [queueData]);

  // avgPrice 계산: 0 대신 최소 가격으로 대체
  const avgPrice = useMemo(() => {
    if (buyBids.length) {
      const totalAmount = buyBids.reduce((sum, b) => sum + b.quantity, 0);
      if (totalAmount === 0) return MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000;
      const totalValue = buyBids.reduce((sum, b) => sum + b.price * b.quantity, 0);
      return Math.round(totalValue / totalAmount / 100) * 100;
    }
    return MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000;
  }, [buyBids, selectedNetwork]);

  // highestPrice도 0일 경우 최소 가격으로 초기화
  const highestPrice = useMemo(() => {
    if (buyBids.length) {
      const maxPrice = Math.max(...buyBids.map((b) => b.price));
      return maxPrice === 0 ? MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000 : maxPrice;
    }
    return MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000;
  }, [buyBids, selectedNetwork]);

  // 📍 minPrice 계산 부분만 아래처럼 수정
  const minPrice = useMemo(() => {
    const floor = MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000;
    const computed = Math.floor(avgPrice * 0.7);
    return Math.max(computed, floor);
  }, [avgPrice, selectedNetwork]);

  const maxPriceAllowed = useMemo(() => {
    if (avgPrice === 0) return MAX_PRICE_CEIL_BY_NETWORK[selectedNetwork] || 11000;
    return Math.min(Math.ceil(avgPrice * 1.3), MAX_PRICE_CEIL_BY_NETWORK[selectedNetwork] || 11000);
  }, [avgPrice, selectedNetwork]);

  // 초기 price 상태 설정 (highestPrice가 0이면 최소가격으로)
  const [price, setPrice] = useState(() =>
    highestPrice === 0
      ? (MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000).toString()
      : highestPrice.toString()
  );

  const dataOptions = ['1GB', '2GB', '3GB', '5GB'];
  const [dataAmount, setDataAmount] = useState('1');

  const priceNum = useMemo(() => (price === '' ? 0 : Number(price)), [price]);
  const dataAmountNum = useMemo(() => (dataAmount === '' ? 0 : Number(dataAmount)), [dataAmount]);

  const totalPrice = useMemo(() => priceNum * dataAmountNum, [priceNum, dataAmountNum]);
  const totalFee = useMemo(() => Math.floor(totalPrice * 0.025), [totalPrice]);
  const totalAfterPoint = useMemo(() => totalPrice - totalFee, [totalPrice, totalFee]);

  const isPriceValid = useMemo(() => {
    if (price === '') return false;
    return priceNum >= minPrice && priceNum <= maxPriceAllowed;
  }, [priceNum, minPrice, maxPriceAllowed]);

  const isDataValid = useMemo(
    () => dataAmountNum > 0 && dataAmountNum <= canSale,
    [dataAmountNum, canSale]
  );

  const userPlanNetwork = useMemo(() => codeToNetworkMap[dataCode] || '', [dataCode]);
  const normalizedUserPlanNetwork = userPlanNetwork.toLowerCase();
  const normalizedSelectedNetwork = selectedNetwork.toLowerCase();

  useEffect(() => {
    if (!isPriceValid && price.length > 0) {
      toast.error(
        `가격은 ${minPrice.toLocaleString()}원 이상 ${maxPriceAllowed.toLocaleString()}원 이하만 가능합니다.`,
        { autoClose: 3000, toastId: 'price-error-toast' }
      );
    }
  }, [price, isPriceValid, minPrice, maxPriceAllowed]);

  useEffect(() => {
    if (dataAmountNum > canSale && data !== 0) {
      toast.error(`보유 데이터(${canSale}GB)보다 많은 양을 판매할 수 없어요.`, {
        autoClose: 3000,
        toastId: 'data-amount-error-toast',
        onOpen: () => setIsBlockingInput(true),
        onClose: () => {
          setIsBlockingInput(false);
          setDataAmount(String(canSale));
        },
      });
    }
  }, [dataAmountNum, canSale, data]);

  const handleSellClick = async () => {
    if (!isPriceValid || !isDataValid || normalizedUserPlanNetwork !== normalizedSelectedNetwork)
      return;

    const payload = {
      price: priceNum,
      dataAmount: dataAmountNum,
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

      await fetchUserData();
    } catch (error) {
      console.error('판매 등록 실패:', error);

      if (error.response) {
        if (error.response.status === 400 && error.response.data?.codeName) {
          setModalStatus(error.response.data.codeName);
        } else {
          setModalStatus('UNKNOWN_ERROR');
        }
      } else {
        setModalStatus('NETWORK_ERROR');
      }

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setModalStatus(null);
      }, 5000);
    }
  };

  const handleSelectData = (option) => {
    const val = Number(option.replace('GB', ''));
    setDataAmount((prev) => String(Number(prev) + val));
  };

  const handleFeeInfoClick = () => {
    toast.info('거래중개 등 제반 서비스 이용료가 포함됩니다.', {
      autoClose: 3000,
      position: 'top-center',
      toastId: 'fee-info-toast',
    });
  };

  const isButtonEnabled =
    isPriceValid && isDataValid && normalizedUserPlanNetwork === normalizedSelectedNetwork;

  // highestPrice 또는 selectedNetwork 변경 시 price 값 재설정
  useEffect(() => {
    setPrice(
      highestPrice === 0
        ? (MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000).toString()
        : highestPrice.toString()
    );
  }, [highestPrice, selectedNetwork]);

  if (isLoading || isQueueLoading) {
    return <SyncLoading text="거래 데이터를 불러오는 중..." />;
  }

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
        <div className="flex-1 space-y-2 text-[14px] text-[#5D5D5D]">
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
        <div className="flex-1 space-y-2 text-[14px]">
          <div className="flex justify-between">
            {avgPrice === (MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000) ? (
              <span className="text-[#FF4343] font-semibold">현재 매물이 없습니다</span>
            ) : (
              <>
                <span>구매 평균가</span>
                <span className="text-[#2C2C2C]">
                  {avgPrice.toLocaleString()}
                  <span className="text-[#565656]"> 원</span>
                </span>
              </>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-[#5D5D5D]">구매 최고가</span>
            <span className="text-[#2C2C2C]">
              {highestPrice.toLocaleString()}
              <span className="text-[#565656]"> 원</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2 flex justify-between items-center">
          <div>판매할 가격</div>
        </div>
        <div className="flex justify-end items-center">
          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => {
              const val = e.target.value;
              if (!/^\d*$/.test(val)) return; // 숫자만 허용
              setPrice(val); // 그대로 입력
            }}
            onBlur={() => {
              if (price === '') return;
              const rounded = Math.round(Number(price) / 100) * 100;
              setPrice(String(rounded));
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
        <div className="text-[15px] text-[#2C2C2C] mb-2 flex justify-between items-center">
          <div>데이터</div>
          <div>판매가능 데이터 : {canSale}GB</div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[12px] text-[#B1B1B1] w-full">얼마나 판매할까요?</span>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="numeric"
              value={dataAmount}
              disabled={isBlockingInput}
              onChange={(e) => {
                const val = e.target.value;
                if (!/^\d*$/.test(val)) return;
                if (val === '') {
                  setDataAmount('');
                  return;
                }
                setDataAmount(String(Number(val)));
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
          <div className="flex items-center gap-1">
            <span>수수료 2.5%</span>
            <button
              type="button"
              onClick={handleFeeInfoClick}
              className="w-4 h-4"
              aria-label="수수료 안내"
            >
              <img src={questionIcon} alt="수수료 안내" className="w-full h-full" />
            </button>
          </div>
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
