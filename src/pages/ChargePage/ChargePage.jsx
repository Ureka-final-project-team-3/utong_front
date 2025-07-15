import React, { useEffect, useState } from 'react';
import { fetchPoint, chargePoint } from '@/apis/mypageApi';
import BackButton from '@/components/BackButton/BackButton';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChargePage = () => {
  const [mileage, setMileage] = useState(null);
  const [amount, setAmount] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount] = useState(600);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const numericAmount = Number(amount) || 0;
  const fee = Math.floor(numericAmount * 0.025);
  const discountedFee = Math.max(fee - (couponApplied ? couponDiscount : 0), 0);
  const totalPrice = () => numericAmount + discountedFee;

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
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="relative">
        <div className="flex items-center justify-center relative">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-lg font-bold text-center">포인트 충전하기</h1>
        </div>
      </div>

      <div className="px-0 py-6">
        {/* 금액 입력 */}
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
                if (value === '') return setAmount('');
                if (!/^\d+$/.test(value)) return;
                setAmount(value);
              }}
            />
            <span className="absolute right-6 top-6.5 transform -translate-y-1/2 text-gray-500">
              P
            </span>
          </div>
        </div>

        {/* 쿠폰 */}
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
            <div className="flex justify-between py-2 text-base text-gray-600">
              <span>잔여 포인트</span>
              <span className="font-medium">{mileage?.toLocaleString() || 0} P</span>
            </div>
            <div className="flex justify-between py-2 text-base text-gray-600">
              <span>충전 포인트</span>
              <span className="font-medium">{numericAmount.toLocaleString()} P</span>
            </div>
            <div className="flex justify-between py-2 text-base text-gray-600">
              <span>수수료 2.5%</span>
              <div className="flex items-center">
                {couponApplied ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">
                      {fee.toLocaleString()} P
                    </span>
                    <span className="font-medium">{discountedFee.toLocaleString()} P</span>
                  </>
                ) : (
                  <span className="font-medium">{fee.toLocaleString()} P</span>
                )}
              </div>
            </div>
            <div className="flex justify-between py-2 text-base text-gray-600">
              <span>총 포인트</span>
              <span className="font-medium">{totalPrice().toLocaleString()} P</span>
            </div>
          </div>

          {couponApplied && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              할인 쿠폰이 적용되었습니다!
            </div>
          )}
        </div>

        {/* 충전 버튼 */}
        <div className="mt-6">
          <button
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={!amount || Number(amount) <= 0}
            className="w-full bg-blue-600 text-white text-base font-medium py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            충전하기
          </button>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />

      {/* 확인 모달 */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow text-center animate-fadeIn">
            <p className="text-sm text-gray-800 mb-6">
              <span className="font-semibold">충전 후 환불은 불가능합니다.</span>
              <br />
              계속 진행하시겠습니까?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-600 text-sm"
              >
                취소
              </button>
              <button
                onClick={handleCharge}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 모달 */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-72 p-6 rounded-xl shadow text-center animate-fadeIn">
            <p className="text-sm text-gray-800 mb-4">충전이 완료되었습니다!</p>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChargePage;
