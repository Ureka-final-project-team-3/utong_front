import React, { useEffect, useState } from 'react';
import EventHeader from './components/EventHeader';
import RouletteEventExtras from './components/RouletteEventExtras';
import RouletteWheel from './components/RouletteWheel';
import StartButton from './components/StartButton';
import { fetchRouletteEventStatus, participateInRoulette } from '@/apis/rouletteApi';

const isTestMode = true; // 테스트 모드 (true면 무조건 당첨)

// 3시 기준 → 12시 기준으로 보정
function toTop0Degree(angle) {
  let corrected = angle - 22.5;
  if (corrected < 0) corrected += 360;
  return corrected;
}

// 당첨 각도 맵 (3시 기준)
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

// 당첨 각도를 피해 랜덤한 꽝 각도 선택
function getRandomNonWinAngle() {
  const prizeAngles = Object.values(prizeAngleMap);
  const allAngles = [];

  for (let angle = 0; angle < 360; angle++) {
    const isPrizeArea = prizeAngles.some(
      (prize) => Math.abs((angle - prize + 360) % 360) <= 22.5
    );
    if (!isPrizeArea) {
      allAngles.push(angle);
    }
  }

  return allAngles[Math.floor(Math.random() * allAngles.length)];
}

const EventPage = () => {
  const [eventInfo, setEventInfo] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rotation, setRotation] = useState(0);

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

    try {
      console.log('startSpin 호출 - eventId:', eventInfo?.eventId);

      const response = isTestMode
        ? {
            resultCode: 200,
            data: { isWinner: false, prizeCode: 'PRIZE1', message: '테스트 당첨!' },
          }
        : await participateInRoulette(eventInfo.eventId);

      console.log('참여 API 응답:', response);

      let prizeAngle;
      let participationData;

      if (response.resultCode >= 200 && response.resultCode < 300) {
        participationData = response.data;

        if (participationData.isWinner) {
          prizeAngle = prizeAngleMap[participationData.prizeCode] ?? 22.5;
        } else {
          prizeAngle = getRandomNonWinAngle();
        }
      } else {
        participationData = {
          isWinner: false,
          message: response.message || response.codeName || '참여에 실패했습니다.',
        };
        prizeAngle = getRandomNonWinAngle();
      }

      const correctedAngle = toTop0Degree(prizeAngle);
      const baseRotation = 360 * 5;
      const finalRotation = baseRotation + correctedAngle;

      setRotation((prev) => prev + finalRotation);

      setTimeout(() => {
        alert(
          participationData.isWinner
            ? `🎉 축하합니다! 당첨되셨습니다! (${participationData.message})`
            : participationData.message || '아쉽지만 당첨되지 않았습니다.'
        );
        setResult(participationData);
        getEventData();
        setIsSpinning(false);
      }, 5000);
    } catch (err) {
      console.error('룰렛 참여 에러:', err.response?.data || err.message || err);

      const rawAngle = getRandomNonWinAngle();
      const correctedAngle = toTop0Degree(rawAngle);
      const baseRotation = 360 * 5;
      const finalRotation = baseRotation + correctedAngle;

      setRotation((prev) => prev + finalRotation);

      setTimeout(() => {
        alert('참여 중 오류가 발생했습니다.');
        setResult({
          isWinner: false,
          message: '참여 중 오류가 발생했습니다.',
        });
        setIsSpinning(false);
      }, 5000);
    }
  };

  return (
    <div className="relative">
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
          <StartButton onClick={startSpin} disabled={isSpinning} />

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md text-center border border-gray-200">
              <p className="text-xl font-semibold text-gray-800">
                {result.isWinner
                  ? `🎉 축하합니다! 당첨되셨습니다!`
                  : result.message || '아쉽지만 당첨되지 않았습니다.'}
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-md text-sm text-gray-700 border border-gray-200">
            <p className="mb-1">
              <strong>현재 당첨자 수:</strong> {eventInfo?.currentWinners ?? '-'} / {eventInfo?.maxWinners ?? '-'}
            </p>
            <p className="mb-1">
              <strong>참여 가능 여부:</strong> {eventInfo?.canParticipate ? '참여 가능' : '참여 불가'}
            </p>
            <p className="mb-1">
              <strong>이벤트 활성화:</strong> {eventInfo?.isActive ? '활성화됨' : '비활성화됨'}
            </p>
            <p className="mb-1">
              <strong>이미 참여:</strong> {eventInfo?.alreadyParticipated ? '예' : '아니오'}
            </p>
            <p>
              <strong>이벤트 기간:</strong>{' '}
              {eventInfo?.startDate
                ? new Date(eventInfo.startDate).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}{' '}
              ~{' '}
              {eventInfo?.endDate
                ? new Date(eventInfo.endDate).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </p>
            <p className="mt-2 text-xs text-gray-500">당첨 확률: {eventInfo?.winProbability ?? '-'}%</p>
          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
