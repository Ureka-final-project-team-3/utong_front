import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/icon/logo.svg';

const totalSlides = 7;

const slideContents = [
  { type: 'image', logo, text: '모든 기능을\n한눈에 알아봐요!' },
  { type: 'text', title: '마이페이지', text: '포인트 충전 및 거래 내역을\n확인해보세요!' },
  {
    type: 'text',
    title: '시세 그래프',
    text: '언제 어떤 거래가 이루어졌는지\n그래프로 한눈에 알아봐요!',
  },
  {
    type: 'text',
    title: '체결 거래',
    text: '언제 어떤 거래가 이루어졌는지\n실시간으로 확인할 수 있어요!',
  },
  { type: 'text', title: '판매 입찰', text: '판매 대기중인 가격과 데이터 양을\n한눈에 알아봐요!' },
  {
    type: 'text',
    title: '구매 입찰',
    text: '구매 대기중인 사용자의 희망가격과\n데이터 양을 한눈에 알아봐요!',
  },
  {
    type: 'text',
    title: '이벤트',
    text: '하루에 한번 룰렛을 돌려 유통에서\n사용가능한 쿠폰을 얻어봐요!',
  },
];

const ServiceGuidePage = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // 드래그 상태 관리
  const dragStartX = useRef(null);
  const dragStartTime = useRef(null);
  const sliderRef = useRef(null);

  const goToSlide = (n) => {
    if (n >= 1 && n <= totalSlides && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(n);
      setDragOffset(0);

      // 트랜지션 완료 후 상태 초기화
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleClose = () => {
    navigate('/mypage');
  };

  // 드래그 시작
  const handleDragStart = (clientX) => {
    if (isTransitioning) return;

    dragStartX.current = clientX;
    dragStartTime.current = Date.now();
    setIsDragging(true);
    setDragOffset(0);
  };

  // 드래그 중
  const handleDragMove = (clientX) => {
    if (!isDragging || dragStartX.current === null || isTransitioning) return;

    const diff = clientX - dragStartX.current;
    const containerWidth = sliderRef.current?.offsetWidth || 300;

    // 드래그 저항 적용 (경계에서 저항감 추가)
    let resistance = 1;
    if ((currentSlide === 1 && diff > 0) || (currentSlide === totalSlides && diff < 0)) {
      resistance = 0.3; // 첫 번째/마지막 슬라이드에서 저항
    }

    const offset = ((diff * resistance) / containerWidth) * 100;
    setDragOffset(Math.max(-30, Math.min(30, offset))); // 최대 30% 이동 제한
  };

  // 드래그 종료
  const handleDragEnd = (clientX) => {
    if (!isDragging || dragStartX.current === null) return;

    const diff = clientX - dragStartX.current;
    const timeDiff = Date.now() - dragStartTime.current;
    const velocity = Math.abs(diff) / timeDiff; // 속도 계산
    const containerWidth = sliderRef.current?.offsetWidth || 300;

    setIsDragging(false);

    // 스와이프 감지 (거리 또는 속도 기준)
    const threshold = containerWidth * 0.2; // 20% 이상 드래그
    const velocityThreshold = 0.5; // 빠른 스와이프

    if (Math.abs(diff) > threshold || velocity > velocityThreshold) {
      if (diff > 0) {
        goToSlide(currentSlide - 1); // 오른쪽 스와이프 (이전 슬라이드)
      } else {
        goToSlide(currentSlide + 1); // 왼쪽 스와이프 (다음 슬라이드)
      }
    } else {
      // 스와이프 취소 - 원래 위치로 돌아가기
      setDragOffset(0);
    }

    // 초기화
    dragStartX.current = null;
    dragStartTime.current = null;
  };

  // 터치 이벤트
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleDragEnd(e.changedTouches[0].clientX);
  };

  // 마우스 이벤트
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    handleDragEnd(e.clientX);
  };

  // 마우스 이벤트 리스너 등록/해제
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const currentContent = slideContents[currentSlide - 1];

  return (
    <div className="relative min-h-auto bg-white flex flex-col items-center justify-center select-none">
      {/* 닫기 버튼 */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-0 text-gray-400 hover:text-gray-600 text-lg font-light z-10 w-8 h-8 flex items-center justify-center"
      >
        ✕
      </button>

      {/* 설명 영역 */}
      <div className="flex flex-col items-center mt-4 mb-6 text-center whitespace-pre-line">
        {currentContent.type === 'image' ? (
          <>
            <img src={currentContent.logo} alt="logo" className="w-6 mb-2" />
            <h2 className="text-base font-semibold text-black leading-snug">
              {currentContent.text}
            </h2>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-1 bg-gradient-to-r from-[#EB008B] to-[#5B038C] bg-clip-text text-transparent">
              {currentContent.title}
            </h2>
            <h2 className="text-base font-semibold text-black leading-snug">
              {currentContent.text}
            </h2>
          </>
        )}
      </div>

      {/* 이미지 영역 - 드래그 가능 */}
      <div
        ref={sliderRef}
        className="relative w-full max-w-sm overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'pan-y pinch-zoom', // 수직 스크롤은 허용, 수평 스크롤은 방지
        }}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(-${(currentSlide - 1) * 100}% + ${dragOffset}%))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {slideContents.map((_, index) => (
            <div key={index} className="w-full flex-shrink-0 flex justify-center">
              <img
                src={`/image/guide${index + 1}.png`}
                alt={`서비스 가이드 ${index + 1}`}
                className="w-[70%] h-auto object-contain rounded-lg"
                onError={(e) => {
                  console.error(`가이드 이미지 로드 실패: guide${index + 1}.png`);
                  e.target.src = '/image/default-guide.png';
                }}
                draggable={false} // 이미지 드래그 방지
              />
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
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

export default ServiceGuidePage;
