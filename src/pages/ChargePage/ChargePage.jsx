import React, { useEffect, useState } from 'react';
import { fetchPoint, chargePoint } from '@/apis/mypageApi';
import BackButton from '@/components/BackButton/BackButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChargePage = () => {
  const [mileage, setMileage] = useState(null);
  const [amount, setAmount] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount] = useState(600); // 예시 할인
  const numericAmount = Number(amount) || 0;
  const fee = Math.floor(numericAmount * 0.025); // 수수료 2.5%
  const discountedFee = Math.max(fee - (couponApplied ? couponDiscount : 0), 0);

  const loadMileage = () => {
    fetchPoint()
      .then((data) => setMileage(data.mileage))
      .catch(console.error);
  };

  useEffect(() => {
    loadMileage();
  }, []);

  const handleCharge = async () => {
    try {
      await chargePoint(Number(amount));
      loadMileage();
    } catch (e) {
      console.error(e);
    }
  };

  const totalPrice = () => {
    return numericAmount + discountedFee;
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="relative ">
        <div className="flex items-center justify-center relative">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-lg font-bold text-center">포인트 충전하기</h1>
        </div>
      </div>

      <div className="px-0 py-6">
        {/* 충전 금액 입력 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">충전 금액</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              className="appearance-none w-full px-10 py-2 border border-gray-300 rounded-lg text-right text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setAmount('');
                  return;
                }
                if (!/^\d+$/.test(value)) return;
                setAmount(value);
              }}
            />
            <span className="absolute right-6 top-6.5 transform -translate-y-1/2 text-gray-500">
              P
            </span>
          </div>
        </div>

        {/* 쿠폰 섹션 */}
        <div className="rounded-lg border-gray-200 p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">쿠폰</span>
            <button
              onClick={() => setCouponApplied(!couponApplied)}
              className="text-sm text-blue-500 flex items-center"
            >
              사용가능한 쿠폰 보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-base text-gray-600">잔여 포인트</span>
              <span className="font-medium text-base">{mileage?.toLocaleString() || 0} P</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-base text-gray-600">충전 포인트</span>
              <span className="font-medium text-base">{numericAmount.toLocaleString()} P</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-base text-gray-600">수수료 2.5%</span>
              <div className="flex items-center">
                {couponApplied ? (
                  <>
                    <span className="line-through text-gray-400 text-base mr-2">
                      {fee.toLocaleString()} P
                    </span>
                    <span className="font-medium text-base">
                      {discountedFee.toLocaleString()} P
                    </span>
                  </>
                ) : (
                  <span className="font-medium text-base">{fee.toLocaleString()} P</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-base text-gray-600">총 포인트</span>
              <span className="font-medium text-base">{totalPrice().toLocaleString()} P</span>
            </div>
          </div>

          {couponApplied && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-blue-700">할인 쿠폰이 적용되었습니다!</span>
              </div>
            </div>
          )}
        </div>

        {/* 충전 버튼 */}
        <div className="mt-6">
          <button
            onClick={handleCharge}
            disabled={!amount || Number(amount) <= 0}
            className="w-full bg-blue-600 text-white text-base font-medium py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            충전하기
          </button>
        </div>
      </div>

      {/* Toast 메시지 출력용 컨테이너 */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default ChargePage;
