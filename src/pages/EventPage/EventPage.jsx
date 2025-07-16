import React, { useEffect, useState } from 'react';
import EventHeader from './components/EventHeader';
import RouletteEventExtras from './components/RouletteEventExtras';
import RouletteWheel from './components/RouletteWheel';
import StartButton from './components/StartButton';
import { fetchRouletteEventStatus, participateInRoulette } from '@/apis/rouletteApi';

const isTestMode = true; // 테스트 모드: true 시 canParticipate 무시

// 꽝(미당첨) 위치 각도 랜덤 반환 (당첨 구간 제외한 6개 구간 중 랜덤)
function getRandomNonWinAngle() {
  // 당첨 영역(270~315도) 제외한 나머지 6개 구간
  const nonWinRanges = [
    [0, 270], // 0~270도 (3시~12시)
    [315, 360], // 315~360도
  ];
  // 0~270도 구간 내에서 랜덤 선택
  const rangeIdx = Math.floor(Math.random() * nonWinRanges.length);
  const range = nonWinRanges[rangeIdx];
  return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}

// 당첨 구간(270~315도) 내 랜덤 각도 반환 (12시 ~ 1시 방향)
function getRandomWinAngle() {
  return 270 + Math.floor(Math.random() * 45); // 270~315도 사이 랜덤
}

const EventPage = () => {
  const [eventInfo, setEventInfo] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 룰렛 회전 각도 상태
  const [rotation, setRotation] = useState(0);

  const getEventData = async () => {
    setError(null);
    try {
      const response = await fetchRouletteEventStatus();
      console.log('이벤트 정보:', response);

      if (response.resultCode >= 200 && response.resultCode < 300) {
        setEventInfo(response.data);
      } else {
        const msg = response.message || response.codeName || '이벤트 정보를 불러오지 못했습니다.';
        setError(msg);
        alert(`이벤트 조회 실패: ${msg}`);
      }
    } catch (err) {
      console.error('이벤트 정보 요청 에러:', err);
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
      const response = await participateInRoulette(eventInfo.eventId);
      console.log('룰렛 참여 응답:', response);

      const baseRotation = 360 * 5; // 기본 5바퀴
      let prizeAngle = 0;
      let participationData = null;

      if (response.resultCode >= 200 && response.resultCode < 300) {
        participationData = response.data;

        prizeAngle = participationData.isWinner
          ? getRandomWinAngle() // 당첨이면 270~315도 (12시 ~ 1시)
          : getRandomNonWinAngle(); // 꽝이면 나머지 구간 랜덤
      } else {
        participationData = {
          isWinner: false,
          message: response.message || response.codeName || '참여에 실패했습니다.',
        };
        prizeAngle = getRandomNonWinAngle();
      }

      setRotation((prev) => prev + baseRotation + prizeAngle);

      setTimeout(() => {
        alert(
          participationData.isWinner
            ? '🎉 축하합니다! 당첨되셨습니다!'
            : participationData.message || '아쉽지만 당첨되지 않았습니다.'
        );
        setResult(participationData);
        getEventData();
        setIsSpinning(false);
      }, 5000);
    } catch (err) {
      console.error('룰렛 참여 에러:', err);
      const baseRotation = 360 * 5;
      const prizeAngle = getRandomNonWinAngle();
      setRotation((prev) => prev + baseRotation + prizeAngle);

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
    <div className="relative overflow-hidden">
      <EventHeader />
      <RouletteEventExtras />

      {/* 룰렛 바퀴에 rotation 각도 전달 */}
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
        </>
      )}
    </div>
  );
};

export default EventPage;
