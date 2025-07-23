import React, { useState } from 'react';
import { fetchCouponUse } from '@/apis/mypageApi'; // 실제 경로로 바꿔주세요

const CouponModal = ({ coupon, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!coupon) return null;

  const handleUseCoupon = async () => {
    try {
      setLoading(true);
      const result = await fetchCouponUse(coupon.userCouponId); // userCouponId 전달
      setMessage('✅ 쿠폰이 성공적으로 사용되었습니다.');
      // 필요 시 onClose(); // 자동으로 닫기
    } catch (error) {
      setMessage('❌ 쿠폰 사용에 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 bg-black/10 flex items-center justify-center">
      <div className="bg-white w-[85%] max-w-xs p-5 rounded-xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 text-xl">
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4 text-gray-800">쿠폰 상세 정보</h2>
        <div className="text-sm text-gray-700 mb-2">
          <strong>쿠폰 ID:</strong> {coupon.couponId}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>상태:</strong> {coupon.statusName}
        </div>
        <div className="text-sm text-gray-700 mb-4">
          <strong>유효기간:</strong>{' '}
          {coupon.expiredAt ? new Date(coupon.expiredAt).toLocaleDateString('ko-KR') : '없음'}
        </div>

        <button
          onClick={handleUseCoupon}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '처리 중...' : '쿠폰 사용하기'}
        </button>

        {message && <p className="mt-3 text-sm text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default CouponModal;
