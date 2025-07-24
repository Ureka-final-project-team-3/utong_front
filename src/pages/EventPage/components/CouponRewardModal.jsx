import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import CouponCard from '../../CouponPage/CouponCard';
import confettiAnimation from './confetti.json'; // 다운 받은 JSON 파일 경로 맞게 import
import winnerSound from '@/assets/sounds/winner.mp3';

const CouponRewardModal = ({ coupon, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const audio = new Audio(winnerSound);
    audio.volume = 0.1;
    audio.play().catch((err) => console.error('사운드 재생 실패:', err));

    // 5초 후 애니메이션 숨기기
    const timer = setTimeout(() => setShowAnimation(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Lottie animationData={confettiAnimation} loop={false} />
        </div>
      )}
      <div
        className="w-[320px] max-w-full p-6 bg-white rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl text-center font-bold text-blue-600 mb-4">축하합니다!</h2>
        <p className="text-[14px] text-center text-gray-700 mb-6">
          당첨 된 쿠폰은 마이페이지 쿠폰함에서 확인하실 수 있습니다.
        </p>
        <CouponCard coupon={coupon} />
        <button
          className="mt-6 w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CouponRewardModal;
