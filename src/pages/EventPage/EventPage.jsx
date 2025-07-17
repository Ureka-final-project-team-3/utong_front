import React, { useEffect, useState } from 'react';
import EventHeader from './components/EventHeader';
import RouletteEventExtras from './components/RouletteEventExtras';
import RouletteWheel from './components/RouletteWheel';
import StartButton from './components/StartButton';
import CouponRewardModal from './components/CouponRewardModal'; // 경로 맞게 수정하세요
import { fetchRouletteEventStatus, participateInRoulette } from '@/apis/rouletteApi';
import { useRouletteSpin } from './hooks/useRouletteSpin';
import useSound from 'use-sound'; // ① useSound import
import spinSoundSrc from '@/assets/sounds/spin.mp3'; // ② 사운드 파일 import

const isTestMode = false;

function toTop0Degree(angle) {
  let corrected = angle - 22.5;
  if (corrected < 0) corrected += 360;
  return corrected;
}

const prizeAngleMap = {
  PRIZE1: 22.5,
  PRIZE2: 67.5,
  PRIZE3: 112.5,
  PRIZE4: 157.5,
  PRIZE5: 202.5,
  PRIZE6: 247.5,
  PRIZE7: 292.5,
  PRIZE8: 337.5,
};

function getRandomNonWinAngle() {
  const prizeAngles = Object.values(prizeAngleMap);
  const allAngles = [];

  for (let angle = 0; angle < 360; angle++) {
    const isNearPrize = prizeAngles.some((prize) => {
      const diff = Math.abs((angle - prize + 360) % 360);
      return diff <= 22.5;
    });
    if (!isNearPrize) {
      allAngles.push(angle);
    }
  }

  const filtered = allAngles.filter((a) => {
    const corrected = toTop0Degree(a);
    return corrected > 40 && corrected < 320;
  });

  const candidates = filtered.length > 0 ? filtered : allAngles;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

const EventPage = () => {
  const [eventInfo, setEventInfo] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [wonCoupon, setWonCoupon] = useState(null);

  const { spinTo } = useRouletteSpin();

  const [playSpin, { stop }] = useSound(spinSoundSrc, { loop: true }); // ③ 루프 재생

  const getEventData = async () => {
    setError(null);
    try {
      const response = await fetchRouletteEventStatus();
      if (response.resultCode >= 200 && response.resultCode < 300) {
        setEventInfo(response.data);
      } else {
        const msg = response.message || response.codeName || '이벤트 정보를 불러오지 못했습니다.';
        setError(msg);
        alert(`이벤트 조회 실패: ${msg}`);
      }
    } catch (err) {
      console.error(err);
      setError('이벤트 정보를 불러오는 중 에러가 발생했습니다.');
      alert('이벤트 정보를 불러오는 중 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventData();
  }, []);

  const startSpin = async () => {
    if (isSpinning || (!eventInfo?.canParticipate && !isTestMode) || !eventInfo?.eventId) {
      if (!eventInfo?.canParticipate && !isTestMode) {
        alert('현재 이벤트에 참여할 수 없습니다.');
      } else if (!eventInfo?.eventId) {
        alert('이벤트 정보가 불완전하여 참여할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
      return;
    }

    setIsSpinning(true);
    setResult(null);
    setError(null);

    playSpin(); // 회전 시작 시 사운드 재생

    try {
      const response = isTestMode
        ? { resultCode: 200, data: { isWinner: false, message: '테스트' } }
        : await participateInRoulette(eventInfo.eventId);

      let prizeAngle;
      let participationData;

      if (response.resultCode >= 200 && response.resultCode < 300) {
        participationData = response.data;
        prizeAngle = participationData.isWinner ? prizeAngleMap.PRIZE1 : getRandomNonWinAngle();
      } else {
        participationData = {
          isWinner: false,
          message: response.message || response.codeName || '참여에 실패했습니다.',
        };
        prizeAngle = getRandomNonWinAngle();
      }

      const correctedAngle = toTop0Degree(prizeAngle);

      spinTo({
        targetAngle: correctedAngle,
        duration: 8000,
        onUpdate: setRotation,
        onDone: () => {
          stop(); // 회전 종료 시 사운드 중지

          setResult(participationData);
          getEventData();
          setIsSpinning(false);

          if (participationData.isWinner) {
            // 백엔드에서 coupon 정보가 없으면 더미 쿠폰 사용
            const couponData = participationData.coupon || {
              name: '10% 할인 쿠폰',
              expiredAt: '2025-12-31T23:59:59Z',
              statusName: '사용 가능',
            };
            setWonCoupon(couponData);
            setShowCouponModal(true);
          } else {
            alert(participationData.message || '아쉽지만 당첨되지 않았습니다.');
          }
        },
      });
    } catch (err) {
      console.error(err);
      const rawAngle = getRandomNonWinAngle();
      const correctedAngle = toTop0Degree(rawAngle);

      spinTo({
        targetAngle: correctedAngle,
        duration: 8000,
        onUpdate: setRotation,
        onDone: () => {
          stop();

          alert('참여 중 오류가 발생했습니다.');
          setResult({ isWinner: false, message: '참여 중 오류가 발생했습니다.' });
          setIsSpinning(false);
        },
      });
    }
  };

  return (
    <div className="relative overflow-hidden">
      <EventHeader />
      <RouletteEventExtras />

      <RouletteWheel isSpinning={isSpinning} rotation={rotation} />

      {loading ? (
        <div className="p-4 max-w-xl mx-auto text-center text-gray-700 font-semibold text-lg mt-20">
          이벤트 정보를 불러오는 중입니다...
        </div>
      ) : error ? (
        <div className="p-4 max-w-xl mx-auto text-center text-red-600 font-semibold text-lg mt-20">
          <p>오류가 발생했습니다: {error}</p>
          <p className="text-base text-gray-500 mt-2">잠시 후 다시 시도해주세요.</p>
        </div>
      ) : (
        <>
          <StartButton
            onClick={startSpin}
            disabled={isSpinning || !eventInfo?.canParticipate || eventInfo?.alreadyParticipated}
          />

          <div className="mt-5 text-center">
            <strong>참여 가능:</strong> {eventInfo?.alreadyParticipated ? '아니오' : '예'}
          </div>

          {/* 쿠폰 당첨 모달 */}
          {showCouponModal && (
            <CouponRewardModal coupon={wonCoupon} onClose={() => setShowCouponModal(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default EventPage;
