import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const totalSlides = 9;

const slideContents = [
  {
    type: 'text',
    title: '한장에 알아보기',
    mainText: '',
    detailText: '',
  },
  {
    type: 'text',
    title: '재판매 불가',
    mainText: '무제한 데이터와 내가 산 데이터는 팔 수 없어요.',
    detailText: '한 번 산 건 끝! 다시 팔기 금지예요.',
  },
  {
    type: 'text',
    title: '거래 단위',
    mainText: '거래는 최소 1GB 단위로만 가능해요.',
    detailText: '0.5GB 같은 건 안 되고, 무조건 1GB 단위예요.',
  },
  {
    type: 'text',
    title: '최소 가격 기준',
    mainText: 'LTE는 최소 4,000P,\n5G는 5,000P 부터 거래 가능해요.',
    detailText: '그보다 저렴하면 거래가 안 돼요.',
  },
  {
    type: 'text',
    title: '거래 가격 단위',
    mainText: '가격은 100P 단위로만 거래 가능해요.',
    detailText: '5,100P은 OK! 5,125P은 안 돼요.',
  },
  {
    type: 'text',
    title: '허용 가격 범위',
    mainText: '현재 평균 가격에서 ±30% 범위\n안에서만 거래할 수 있어요.',
    detailText: '너무 싸게 또는 너무 비싸게는 못 팔아요.',
  },
  {
    type: 'text',
    title: '자동 최적 거래',
    mainText: '매물 상황에 따라 자동으로\n최적의 거래가 이루어져요.',
    detailText:
      '판매 시: 등록된 구매 매물 중 가장 높은 가격 판매\n구매 시: 등록된 판매 매물 중 가장 낮은 가격 구매',
  },
  {
    type: 'text',
    title: '판매 제한량',
    mainText: '사용자 요금제가 제공하는 데이터의\n10%만 판매 가능해요.',
    detailText: '정책상 일부만 판매할 수 있도록 제한되어 있어요.',
  },
  {
    type: 'text',
    title: '요금제 동일 조건',
    mainText: '사용 중인 요금제만 거래가능해요.',
    detailText: '5G 요금제는 5G끼리,\nLTE 요금제는 LTE끼리만 거래 가능해요.',
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
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const handleClose = () => navigate(-1);

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
    if ((currentSlide === 1 && diff > 0) || (currentSlide === totalSlides && diff < 0))
      resistance = 0.3;
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

    if (Math.abs(diff) > threshold || velocity > velocityThreshold) {
      if (diff > 0 && currentSlide > 1) goToSlide(currentSlide - 1);
      else if (diff < 0 && currentSlide < totalSlides) goToSlide(currentSlide + 1);
      else resetSlide();
    } else {
      resetSlide();
    }

    dragStartX.current = null;
    dragStartTime.current = null;
  };

  const resetSlide = () => {
    setIsTransitioning(true);
    setDragOffset(0);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleTouchStart = (e) => handleDragStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleDragMove(e.touches[0].clientX);
  const handleTouchEnd = (e) => handleDragEnd(e.changedTouches[0].clientX);
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
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* 닫기 버튼 */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-0 text-gray-400 hover:text-gray-600 text-lg font-light z-10 w-8 h-8 flex items-center justify-center cursor-pointer"
      >
        ✕
      </button>

      {/* 고정된 타이틀 */}
      {currentContent.title && (
        <div className="mt-[20px] mb-4 text-center">
          <h2 className="text-lg font-bold bg-gradient-to-r from-[#EB008B] to-[#5B038C] bg-clip-text text-transparent">
            {currentContent.title}
          </h2>
        </div>
      )}

      {/* 슬라이더 */}
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
          {slideContents.map((content, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 flex flex-col items-center justify-center px-4 text-center"
            >
              <img
                src={`/image/trade${index + 1}.png`}
                alt={`서비스 가이드 ${index + 1}`}
                className="w-[70%] h-auto object-contain rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = '/image/default-guide.png';
                }}
                draggable={false}
              />
              {content.mainText && (
                <div className="text-base text-[16px] font-semibold text-gray-800 leading-snug mb-1 whitespace-pre-line">
                  {content.mainText}
                </div>
              )}
              {content.detailText && (
                <div className="text-sm text-[11px] font-medium text-gray-500 leading-snug whitespace-pre-line">
                  {content.detailText}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이터 */}
      <div className="flex gap-2 mt-4 mb-6">
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
