import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar/NavigationBar';
import bgcheck from '@/assets/icon/bgcheck.svg';
import utongLogo from '@/assets/icon/bglogo.svg';
import { AnimatePresence, motion } from 'framer-motion';
import useAlertStream from '@/hooks/useAlertStream';
import useOrderQueueSSE from '../hooks/useOrderQueueSSE';
import { ToastContainer } from 'react-toastify';
import useLivePriceSSE from '../hooks/useLivePriceSSE';

const DefaultLayout = () => {
  const location = useLocation();
  const bgPages = ['/', '/event', '/mypage'];
  const isColoredOutlet = bgPages.includes(location.pathname);
  const token = localStorage.getItem('accessToken');

  useAlertStream(token);
  useOrderQueueSSE(token);
  useLivePriceSSE(token);
  const [containerHeight, setContainerHeight] = useState('100vh');

  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      if (window.innerWidth < 640) {
        setContainerHeight('calc(var(--vh, 1vh) * 100)');
      } else {
        setContainerHeight('780px');
      }
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    window.addEventListener('load', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
      window.removeEventListener('load', updateHeight);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-[#FFF9F1] flex items-center justify-center sm:gap-30">
      {/* PC 설명 영역 */}
      <div className="hidden md:flex flex-1 justify-end h-full">
        <div className="flex flex-col justify-center w-full max-w-[360px] text-sm leading-relaxed text-center items-center">
          <img src={utongLogo} alt="유통 로고" className="w-30 mb-4" />
          <h2 className="text-[22px] font-bold text-gray-500 mb-10">너로 통하다</h2>
          <p className="mb-5 text-[18px] font-bold text-gray-500">
            데이터를 쉽고, 안전하게 거래하세요.
          </p>
          <ul className="space-y-6 text-gray-500 text-[17px] font-bold">
            {[
              '실시간 가격 반영',
              '간편한 포인트 결제',
              '주식거래와 유사한 UX',
              '매일 제공되는 이벤트',
            ].map((text, index) => (
              <li key={index} className="flex items-center gap-x-6">
                <div className="w-8 h-8 flex-shrink-0">
                  <img src={bgcheck} alt="체크 아이콘" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex items-center h-12">
                  <span className="text-left w-full">{text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 앱 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex justify-center md:justify-start items-center h-full">
        <div
          className="w-full sm:w-[360px] bg-white shadow-xl relative flex flex-col overflow-hidden"
          style={{ height: containerHeight }}
        >
          {/* Toast */}
          <ToastContainer
            position="top-center"
            autoClose={2000}
            style={{
              position: 'absolute',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: 400,
              zIndex: 9999,
              pointerEvents: 'auto',
            }}
          />

          {/* 콘텐츠 영역 */}
          <div
            className={`flex-1 overflow-y-auto scrollbar-hide px-[30px] pb-[0px]
              ${isColoredOutlet ? 'bg-gradient-blue' : 'bg-background'}
              pt-[10px] sm:pt-[55px]
            `}
          >
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ height: '100%' }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 하단 네비게이션 */}
          <div className="h-[49px] w-full sm:static sm:left-auto sm:translate-x-0 z-10">
            <NavigationBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
