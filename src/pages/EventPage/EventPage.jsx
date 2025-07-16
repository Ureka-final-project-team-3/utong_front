import React, { useState, useRef } from 'react';
import EventHeader from './components/EventHeader';
import RouletteEventExtras from './components/RouletteEventExtras';
import RouletteWheel from './components/RouletteWheel';
import StartButton from './components/StartButton';

const EventPage = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef(null);

  const startSpin = () => {
    if (isSpinning) return; // 이미 돌고 있으면 무시

    setIsSpinning(true);

    // 5바퀴 돌고 0~360도 사이 랜덤으로 멈춤
    const rotationDegrees = 360 * 5 + Math.floor(Math.random() * 360);

    if (wheelRef.current) {
      // transition 초기화 (이전 애니메이션 영향 제거)
      wheelRef.current.style.transition = 'none';
      wheelRef.current.style.transform = `rotate(0deg)`;

      // 브라우저에게 스타일 변경 인지할 시간 부여 (필수)
      setTimeout(() => {
        if (!wheelRef.current) return;

        wheelRef.current.style.transition = 'transform 5s ease-out';
        wheelRef.current.style.transform = `rotate(${rotationDegrees}deg)`;
      }, 50);
    }

    // transitionend 이벤트로 애니메이션 완료 감지
    const onTransitionEnd = () => {
      setIsSpinning(false);
      if (wheelRef.current) {
        wheelRef.current.style.transition = 'none'; // transition 리셋
      }
      const normalizedDegree = rotationDegrees % 360;
      alert(`룰렛이 멈췄어요! 각도: ${normalizedDegree.toFixed(0)}도`);

      wheelRef.current.removeEventListener('transitionend', onTransitionEnd);
    };

    wheelRef.current?.addEventListener('transitionend', onTransitionEnd);
  };

  return (
    <div className="relative">
      <EventHeader />
      <RouletteEventExtras />
      <RouletteWheel ref={wheelRef} />
      <StartButton onClick={startSpin} disabled={isSpinning} />
    </div>
  );
};

export default EventPage;
