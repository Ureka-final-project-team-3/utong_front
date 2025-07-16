import React, { useEffect, useState } from 'react';
import { fetchMyInfo, fetchCoupons } from '@/apis/mypageApi';
import BackButton from '@/components/BackButton/BackButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PointChargePage = () => {
  const [amount, setAmount] = useState('');
  const [currentMileage, setCurrentMileage] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [couponApplied] = useState(false);
  const [customerName, setCustomerName] = useState('홍길동');
  const [modal, setModal] = useState({ open: false, message: '', success: false });

  const feeRate = 0.025;
  const numericAmount = Number(amount) || 0;
  const fee = couponApplied ? 0 : Math.floor(numericAmount * feeRate);
  useEffect(() => {
    if (selectedCouponId) {
      toast.info('할인 쿠폰이 적용되었습니다!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  }, [selectedCouponId]);

  const loadData = async () => {
    try {
      const user = await fetchMyInfo();
      setCurrentMileage(user.mileage);
      setCustomerName(user.name || '홍길동');

      const allCoupons = await fetchCoupons();
      const usable = allCoupons.filter((c) => c.couponCode === '001' && c.statusCode === '002');
      setCoupons(usable);
      setSelectedCouponId(null);
    } catch (err) {
      console.error('에러 발생:', err);
      alert('유저 정보 또는 쿠폰 조회 실패. 다시 로그인해주세요.');
      localStorage.removeItem('accessToken');
      window.location.href = '/index.html';
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePayment = () => {
    if (numericAmount <= 0) {
      alert('충전 금액을 입력해주세요.');
      return;
    }

    const clientKey = 'test_ck_26DlbXAaV0K9nO22Nqkn3qY50Q9R';
    const tossPayments = window.TossPayments(clientKey);
    const orderId = `order_${Date.now()}`;

    localStorage.setItem('orderId', orderId);
    localStorage.setItem('amount', numericAmount.toString());
    selectedCouponId
      ? localStorage.setItem('userCouponId', selectedCouponId)
      : localStorage.removeItem('userCouponId');

    tossPayments
      .requestPayment('카드', {
        amount: numericAmount,
        orderId,
        orderName: '포인트 충전',
        customerName,
        successUrl: window.location.href,
        failUrl: window.location.href,
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = parseInt(params.get('amount'));
    const userCouponId = localStorage.getItem('userCouponId');
    const accessToken = localStorage.getItem('accessToken');

    if (!paymentKey || !orderId || !amount || !accessToken) return;

    const body = { paymentKey, orderId, amount };
    if (userCouponId) body.userCouponId = userCouponId;

    fetch('/api/payments/toss/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.codeName === 'SUCCESS') {
          setModal({
            open: true,
            success: true,
            message: `충전 완료 🎉\n충전금액: ${data.data.chargedAmount}원\n수수료: ${data.data.feeAmount}원\n실제 적립 포인트: ${data.data.finalAmount}P\n총 포인트: ${data.data.updatedMileage}P`,
          });
          setCurrentMileage(data.data.updatedMileage);
          localStorage.removeItem('userCouponId');
        } else {
          setModal({ open: true, success: false, message: `충전 실패 ❌\n${data.message}` });
        }
      })
      .catch((err) => {
        setModal({ open: true, success: false, message: `오류 발생: ${err.message}` });
      });
  }, []);

  return (
    <div className="">
      <div className="relative">
        <div className="flex items-center justify-center relative">
          <div className="absolute left-0">
            <BackButton />
          </div>
          <h1 className="text-lg font-bold text-center">포인트 충전하기</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">충전 금액</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            className="w-full px-10 py-2 border border-gray-300 rounded-lg text-right text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') return setAmount('');
              if (!/^[0-9]+$/.test(value)) return;
              setAmount(value);
            }}
          />
          <span className="absolute right-6 top-6 transform -translate-y-1/2 text-gray-500">P</span>
        </div>
      </div>

      {/* 쿠폰 영역 */}
      <div className="rounded-lg border-gray-200 p-4 mt-4">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <label className="text-base font-medium text-gray-700 whitespace-nowrap w-[90px]">
              쿠폰 선택
            </label>
            {coupons.length > 0 ? (
              <select
                value={selectedCouponId || ''}
                onChange={(e) => setSelectedCouponId(e.target.value)}
                className="w-2/3 max-w-xs text-sm px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">쿠폰을 선택하세요</option>
                {coupons.map((coupon) => (
                  <option key={coupon.userCouponId} value={coupon.userCouponId}>
                    {(coupon.name || '수수료 면제 쿠폰').slice(0, 10)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-gray-400">사용 가능한 쿠폰이 없습니다</span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 text-base text-gray-600">
            <span>잔여 포인트</span>
            <span className="font-medium">{currentMileage.toLocaleString()} P</span>
          </div>
          <div className="flex justify-between py-2 text-base text-gray-600">
            <span>충전 포인트</span>
            <span className="font-medium">{numericAmount.toLocaleString()} P</span>
          </div>
          <div className="flex justify-between py-2 text-base text-gray-600">
            <span>수수료 2.5%</span>
            <span className="font-medium">{(selectedCouponId ? 0 : fee).toLocaleString()} P</span>
          </div>
          <div className="flex justify-between py-2 text-base text-gray-600">
            <span>총 포인트</span>
            <span className="font-medium">
              {(numericAmount - (selectedCouponId ? 0 : fee)).toLocaleString()} P
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handlePayment}
          disabled={!amount || Number(amount) <= 0}
          className="w-full bg-blue-600 text-white text-base font-medium py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          충전하기
        </button>
      </div>

      {/* 모달 */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {modal.success ? '🎉 충전 성공' : '❌ 충전 실패'}
            </h2>
            <pre className="whitespace-pre-wrap text-sm text-left mb-4">{modal.message}</pre>
            <button
              onClick={() => {
                setModal({ open: false, message: '', success: false });
                const url = new URL(window.location.href);
                url.search = '';
                window.history.replaceState({}, '', url.toString());
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              확인
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default PointChargePage;
