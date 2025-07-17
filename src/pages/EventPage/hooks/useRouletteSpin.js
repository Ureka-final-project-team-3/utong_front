import { useRef } from 'react';

export const useRouletteSpin = () => {
  const animationRef = useRef(null);

  const spinTo = ({ targetAngle, duration = 8000, onUpdate, onDone }) => {
  cancelAnimationFrame(animationRef.current);

  const startRotation = 0;
  const totalRotation = 360 * 15 + targetAngle;

  let startTime = null;

  // easing 함수
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0~1

    const eased = easeOutCubic(progress);
    const currentRotation = startRotation + totalRotation * eased;

    onUpdate(currentRotation);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onDone?.();
    }
  };

  animationRef.current = requestAnimationFrame(animate);
};


  return { spinTo };
};
