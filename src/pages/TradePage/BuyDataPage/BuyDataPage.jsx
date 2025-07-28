import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BuyDataHeader from './components/BuyDataHeader';
import Button from '../../../components/common/Button';

import useUserStore from '@/stores/useUserStore';
import useTradeStore from '@/stores/tradeStore';
import useModalStore from '@/stores/modalStore';

import PointRechargeModal from './components/PointRechargeModal';
import BuySuccessModal from './components/BuySuccessModal';
import ReservationModal from './components/ReservationModal';
import PaymentCompleteModal from './components/PaymentCompleteModal';

import { postBuyOrder } from '@/apis/dataTradeApi';
import useOrderQueue from '@/hooks/useOrderQueue';

import SyncLoading from '@/components/Loading/SyncLoading';

import { MIN_PRICE_FLOOR_BY_NETWORK } from '../constants/priceRange';
import BuyFailModal from './components/BuyFailModal';

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
    canSale,
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

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const userPlanNetwork = codeToNetworkMap[dataCode] || '';

  const { queueData, isLoading } = useOrderQueue(localDataCode);

  const sellBids = queueData?.sellOrderQuantity
    ? Object.entries(queueData.sellOrderQuantity).map(([price, quantity]) => ({
        price: Number(price),
        quantity,
      }))
    : [];

  const avgPrice = sellBids.length
    ? Math.round(
        sellBids.reduce((sum, b) => sum + b.price * b.quantity, 0) /
          sellBids.reduce((sum, b) => sum + b.quantity, 0) /
          100
      ) * 100
    : MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000;

  const minPrice = sellBids.length
    ? Math.min(...sellBids.map((b) => b.price))
    : MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000;

  const priceFloor = MIN_PRICE_FLOOR_BY_NETWORK[selectedNetwork] || 4000;

  const [selectedDataGB, setSelectedDataGB] = useState(1);
  const [buyPrice, setBuyPrice] = useState(minPrice.toString());
  const [failMessage, setFailMessage] = useState('');
  const [showFailModal, setShowFailModal] = useState(false);

  // minPrice 변경 시 buyPrice도 갱신하도록 추가
  useEffect(() => {
    setBuyPrice(minPrice.toString());
  }, [minPrice]);

  useEffect(() => {
    const code = networkToDataCodeMap[selectedNetwork] || '002';
    setLocalDataCode(code);
    setSelectedDataGB(1);
  }, [selectedNetwork]);

  const buyPriceNum = Number(buyPrice) || 0;
  const dataOptions = ['1GB', '2GB', '3GB', '5GB'];

  const isPriceValid = buyPriceNum >= priceFloor;
  const isDataValid = selectedDataGB > 0;
  const isUserPlanMatches = userPlanNetwork === selectedNetwork;
  const isButtonEnabled = isPriceValid && isDataValid && isUserPlanMatches;

  const handleBuyPriceChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setBuyPrice(val);
    }
  };

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
    if (!isButtonEnabled) {
      toast.error('입력값을 확인해 주세요.', { toastId: 'buy-button-error' });
      return;
    }

    const roundedPrice = Math.round(Number(buyPrice) / 100) * 100;
    setBuyPrice(String(roundedPrice));

    const buyPriceRoundedNum = roundedPrice;
    const selectedQty = Number(selectedDataGB) || 0;
    const totalPrice = buyPriceRoundedNum * selectedQty;

    if (point < totalPrice) {
      openModal('showRechargeModal');
      return;
    }

    try {
      const payload = {
        price: buyPriceRoundedNum,
        dataAmount: selectedQty,
        dataCode: localDataCode,
      };

      const response = await postBuyOrder(payload);

      switch (response.result) {
        case 'ALL_COMPLETE':
          openModal('showSuccessModal');
          break;
        case 'PART_COMPLETE':
          openModal('showPaymentCompleteModal');
          break;
        case 'WAITING':
          openModal('showReservationModal');
          break;
        default:
          alert('알 수 없는 성공 응답입니다.');
      }
    } catch (error) {
      if (error.response) {
        const { data, status } = error.response;

        if (status === 400) {
          switch (data.resultCode) {
            case 'INSUFFICIENT_POINT':
              openModal('showRechargeModal');
              break;
            case 'NEED_DEFAULT_LINE':
              setFailMessage('기본 회선을 설정해 주세요.');
              setShowFailModal(true);
              break;
            case 'EXIST_SALE_REQUEST':
              setFailMessage('이미 판매 요청이 존재합니다.');
              setShowFailModal(true);
              break;
            case 'UNIT_ERROR':
              setFailMessage('100원 단위로 판매해 주세요.');
              setShowFailModal(true);
              break;
            default:
              setFailMessage(data.message || '알 수 없는 오류가 발생했습니다.');
              setShowFailModal(true);
          }
        } else {
          setFailMessage('서버 오류가 발생했습니다.');
          setShowFailModal(true);
        }
      } else {
        setFailMessage('구매 요청 중 오류가 발생했습니다.');
        setShowFailModal(true);
      }
    } finally {
      fetchUserData();
    }
  };

  if (isLoading) {
    return <SyncLoading text="데이터를 불러오는 중입니다..." />;
  }

  return (
    <div className="relative h-full">
      <div style={{ position: 'relative' }}>
        <BuyDataHeader />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 400,
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        />
      </div>

      <PointRechargeModal
        show={showRechargeModal}
        onClose={() => closeModal('showRechargeModal')}
      />
      <BuySuccessModal show={showSuccessModal} onClose={() => closeModal('showSuccessModal')} />
      {showReservationModal && (
        <ReservationModal onClose={() => closeModal('showReservationModal')} />
      )}
      {showPaymentCompleteModal && (
        <PaymentCompleteModal
          point={point}
          onClose={() => closeModal('showPaymentCompleteModal')}
        />
      )}
      <BuyFailModal
        show={showFailModal}
        message={failMessage}
        onClose={() => setShowFailModal(false)}
      />

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
              {canSale === -1 ? '무제한' : `${data} `}
              {canSale !== -1 && <span className="text-[#565656]">GB</span>}
            </span>
          </div>
        </div>

        <div className="w-px h-[35px] bg-[#D9D9D9]" />

        <div className="flex-1 space-y-2 text-[14px]">
          <div className="flex justify-between">
            {!sellBids.length ? (
              <span className="text-[#2769f6] font-semibold">현재 매물이 없습니다</span>
            ) : (
              <>
                <span>판매 평균가</span>
                <span className="text-[#2C2C2C]">
                  {avgPrice.toLocaleString()}
                  <span className="text-[#565656]"> 원</span>
                </span>
              </>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D5D5D]">판매 최저가</span>
            <span className="text-[#2C2C2C]">
              {minPrice.toLocaleString()} <span className="text-[#565656]">원</span>
            </span>
          </div>
        </div>
      </div>

      {/* 가격 입력 영역 */}
      <div className="mt-6 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2">구매할 가격</div>
        <div className="flex justify-end items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={buyPrice}
            onChange={handleBuyPriceChange}
            onBlur={() => {
              if (buyPrice === '') return;
              const rounded = Math.round(Number(buyPrice) / 100) * 100;

              if (rounded < priceFloor) {
                toast.error(`가격은 ${priceFloor.toLocaleString()}원 이상이어야 합니다.`, {
                  autoClose: 3000,
                  toastId: 'buy-price-error',
                });
                setBuyPrice(String(minPrice));
              } else {
                setBuyPrice(String(rounded));
              }
            }}
            className="text-[20px] font-medium text-right w-full bg-transparent outline-none"
          />
          <span className="ml-1 text-[20px] text-[#2C2C2C]">P</span>
        </div>
      </div>

      <div className="mt-4 text-[11px] text-[#386DEE] text-center">
        현재 평균 가격에서 ±30% 범위 안에서만 거래할 수 있어요.
      </div>

      {/* 데이터 GB 입력 영역 */}
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
            onBlur={() => {
              if (selectedDataGB < 0) {
                toast.error(`데이터 용량은 0 이상이어야 합니다.`, {
                  toastId: 'buy-data-error',
                });
              }
            }}
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

      <div className="mt-4 text-[11px] text-[#386DEE] text-center">
        최저가 보다 양이나 가격이 작으면 구매대기가 됩니다.
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
