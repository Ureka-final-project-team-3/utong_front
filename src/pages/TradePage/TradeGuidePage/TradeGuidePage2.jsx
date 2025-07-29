import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/icon/logo.svg';

const totalSlides = 9;

const slideContents = [
  {
    type: 'text',
    text: '', // 첫 번째 슬라이드는 텍스트 없음
  },
  {
    type: 'text',
    text: '무제한 데이터와 내가 산 데이터는 팔 수 없어요.\n한 번 산 건 끝! 다시 팔기 금지예요.',
  },
  {
    type: 'text',
    text: '거래는 최소 1GB 단위로만 가능해요.\n0.5GB 같은 건 안 되고, 무조건 1GB 단위예요.',
  },
  {
    type: 'text',
    text: 'LTE는 최소 4,000원,\n5G는 5,000원 부터 거래 가능해요.\n그보다 저렴하면 거래가 안 돼요.',
  },
  {
    type: 'text',
    text: '가격은 100원 단위로만 거래 가능해요.\n5,100원은 OK! 5,125원은 안 돼요.',
  },
  {
    type: 'text',
    text: '현재 평균 가격에서 ±30% 범위 안에서만\n거래할 수 있어요.\n너무 싸게 또는 너무 비싸게는 못 팔아요.',
  },
  {
    type: 'text',
    text: '매물 상황에 따라 자동으로 \n최적의 거래가 이루어져요.\n판매 시: 등록된 구매 매물 중 가장 높은 가격에 판매돼요.\n구매 시: 등록된 판매 매물 중 가장 낮은 가격에 구매돼요.',
  },
  {
    type: 'text',
    text: '사용자 요금제가 제공하는 데이터의\n10%만 판매 가능해요.\n정책상 일부만 판매할 수 있도록 제한되어 있어요.',
  },
  {
    type: 'text',
    text: '사용 중인 요금제만 거래할 수 있어요.\n5G 요금제는 5G끼리,\nLTE 요금제는 LTE끼리만 거래 가능해요',
  },
];

const TradeGuidePage2 = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const dragStartX = useRef(null);
  const dragStartTime = useRef(null);
  const sliderRef = useRef(null);

  const goToSlide = (n) => {
    if (n >= 1 && n <= totalSlides && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(n);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  const handleDragStart = (clientX) => {
    if (isTransitioning) return;
    dragStartX.current = clientX;
    dragStartTime.current = Date.now();
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || dragStartX.current === null || isTransitioning) return;
    const diff = clientX - dragStartX.current;
    const containerWidth = sliderRef.current?.offsetWidth || 300;
    let resistance = 1;
    if ((currentSlide === 1 && diff > 0) || (currentSlide === totalSlides && diff < 0)) {
      resistance = 0.3;
    }
    const offset = ((diff * resistance) / containerWidth) * 100;
    setDragOffset(Math.max(-30, Math.min(30, offset)));
  };

  const handleDragEnd = (clientX) => {
    if (!isDragging || dragStartX.current === null) return;
    const diff = clientX - dragStartX.current;
    const timeDiff = Date.now() - dragStartTime.current;
    const velocity = Math.abs(diff) / timeDiff;
    const containerWidth = sliderRef.current?.offsetWidth || 300;

    setIsDragging(false);

    const threshold = containerWidth * 0.2;
    const velocityThreshold = 0.5;

    const isFirst = currentSlide === 1;
    const isLast = currentSlide === totalSlides;

    if (Math.abs(diff) > threshold || velocity > velocityThreshold) {
      if (diff > 0 && !isFirst) {
        goToSlide(currentSlide - 1);
      } else if (diff < 0 && !isLast) {
        goToSlide(currentSlide + 1);
      } else {
        // 끝인데 잘못된 방향 → 되돌림
        setIsTransitioning(true);
        setDragOffset(0);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }
    } else {
      // 임계치 못 넘김 → 되돌림
      setIsTransitioning(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }

    dragStartX.current = null;
    dragStartTime.current = null;
  };

  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    handleDragEnd(e.changedTouches[0].clientX);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      handleDragMove(e.clientX);
    },
    [isDragging, currentSlide, isTransitioning]
  );

  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      handleDragEnd(e.clientX);
    },
    [isDragging, currentSlide]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const currentContent = slideContents[currentSlide - 1];

  return (
    <div className="relative min-h-auto flex flex-col items-center justify-center select-none">
      <button
        onClick={handleClose}
        className="absolute top-4 right-0 text-gray-400 hover:text-gray-600 text-lg font-light z-10 w-8 h-8 flex items-center justify-center"
      >
        ✕
      </button>

      <div
        ref={sliderRef}
        className="relative w-full max-w-sm overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y pinch-zoom',
        }}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(calc(-${(currentSlide - 1) * 100}% + ${dragOffset}%))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {slideContents.map((_, index) => (
            <div key={index} className="w-full flex-shrink-0 flex justify-center">
              <img
                src={`/image/trade${index + 1}.png`}
                alt={`서비스 가이드 ${index + 1}`}
                className="w-[70%] h-auto object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = '/image/default-guide.png';
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 텍스트 영역 - 이미지 아래로 이동, 첫 번째 슬라이드는 텍스트가 없음 */}
      {currentContent.text && (
        <div className="flex flex-col items-center mt-6 mb-4 text-center">
          {currentContent.text.split('\n').map((line, index) => {
            // 줄마다 다른 색상 적용
            const colors = ['text-gray-800', 'text-gray-500'];
            const colorClass = colors[index % colors.length];

            return (
              <div key={index} className={`text-base font-semibold leading-snug ${colorClass}`}>
                {line}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2 mt-6">
        {[...Array(totalSlides)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i + 1)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i + 1 === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TradeGuidePage2;
