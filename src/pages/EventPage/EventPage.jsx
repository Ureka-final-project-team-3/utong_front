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
import RemainingTimeDisplay from './components/RemainingTimeDisplay';
import FailRewardModal from './components/FailRewardModal';
import useAuth from '@/hooks/useAuth'; // useAuth 훅 import
import { motion, AnimatePresence } from 'framer-motion';

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
  const { user, isLoading: authLoading } = useAuth(); // useAuth 훅 사용

  const [eventInfo, setEventInfo] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [wonCoupon, setWonCoupon] = useState(null);
  const [showFailModal, setShowFailModal] = useState(false);

  const { spinTo } = useRouletteSpin();

  const [playSpin, { stop }] = useSound(spinSoundSrc, { loop: true, volume: 0.1 }); // ③ 루프 재생

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
    if (result !== null) {
      console.log('참여 결과:', result);
    }
  }, [result]);

  useEffect(() => {
    // 인증 로딩이 끝나고 사용자가 있을 때만 이벤트 데이터 가져오기
    if (!authLoading && user) {
      if (isTestMode) {
        setEventInfo({
          eventId: 'test-event',
          canParticipate: true,
          alreadyParticipated: false,
        });
        setLoading(false);
      } else {
        getEventData();
      }
    }
  }, [authLoading, user]);

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
        ? {
            resultCode: 200,
            data: { isWinner: false, alreadyParticipated: true, message: '테스트' },
          }
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
            const couponData = {
              name: participationData.gifticonDescription || '당첨된 쿠폰',
              expiredAt: participationData.expiredAt || null, // 유효기간 포함
              statusName: '사용 가능',
              eventTitle: participationData.eventTitle || '',
            };
            setWonCoupon(couponData);
            setShowCouponModal(true);
          } else {
            setShowFailModal(true); // 꽝일 때 전용 모달
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

  // 인증 로딩 중이면 로딩 화면 표시
  if (authLoading) {
    return (
      <div className="relative overflow-hidden">
        <EventHeader />
        <div className="p-4 max-w-xl mx-auto text-center text-gray-700 font-semibold text-lg mt-20">
          로딩 중입니다...
        </div>
      </div>
    );
  }

  // 사용자가 없으면 useAuth에서 자동으로 로그인 페이지로 리다이렉트
  if (!user) {
    return null;
  }

  return (
    <div className="relative overflow-visible pb-12">
      {/* 유통통 - 뒤쪽 레이어 (낮은 z-index) */}
      <div className="relative z-10">
        <EventHeader />
        <RouletteEventExtras />
      </div>

      {/* 룰렛 - 앞쪽 레이어 (높은 z-index) */}
      <AnimatePresence mode="wait">
        <motion.div
          key="wheel"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-20"
        >
          <RouletteWheel isSpinning={isSpinning} rotation={rotation} />
        </motion.div>
      </AnimatePresence>

      {loading ? (
        <div className="p-4 max-w-xl mx-auto text-center text-gray-700 font-semibold text-lg mt-20">
          이벤트 정보를 불러오는 중입니다...
        </div>
      ) : error ? (
        <motion.div
          className="p-4 max-w-xl mx-auto text-center text-red-600 font-semibold text-lg mt-20"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <p>오류가 발생했습니다: {error}</p>
          <p className="text-base text-gray-500 mt-2">잠시 후 다시 시도해주세요.</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
            transition={{
              duration: 0.6,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 3, // 3초마다 반복
            }}
          >
            <StartButton
              onClick={startSpin}
              disabled={isSpinning || !eventInfo?.canParticipate || eventInfo?.alreadyParticipated}
            />
          </motion.div>

          <AnimatePresence>
            {eventInfo?.alreadyParticipated && (
              <motion.div
                key="already"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mt-5 text-center text-[#777777]">이미 참여했습니다</div>
                <RemainingTimeDisplay resetHour={0} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 쿠폰 당첨 모달 */}
          {showCouponModal && (
            <CouponRewardModal coupon={wonCoupon} onClose={() => setShowCouponModal(false)} />
          )}
          {showFailModal && <FailRewardModal onClose={() => setShowFailModal(false)} />}
        </>
      )}
    </div>
  );
};

export default EventPage;
