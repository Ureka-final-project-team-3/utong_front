import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar/NavigationBar';
import bgcheck from '@/assets/icon/bgcheck.svg';
import { AnimatePresence, motion } from 'framer-motion';
import utongLogo from '@/assets/icon/bglogo.svg'; // 설명 옆 로고 (예시)

const DefaultLayout = () => {
  const location = useLocation();
  const bgPages = ['/', '/event', '/mypage'];
  const isColoredOutlet = bgPages.includes(location.pathname);

  return (
    <div className="absolute inset-0 z-0 bg-[#FFF9F1] flex items-center justify-center sm:gap-30">
      {/* 전체 2분할 구조 */}
      <div className="hidden md:flex flex-1 justify-end h-full">
        <div className="flex flex-col justify-center w-full max-w-[360px]  text-sm leading-relaxed  text-center items-center">
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
                {' '}
                {/* gap 조정 */}
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
          className={`
      w-full h-full
      sm:w-[360px] sm:h-[780px]
      bg-white shadow-xl relative flex flex-col overflow-hidden
    `}
        >
          <div
            className={`
    flex-1 overflow-y-auto scrollbar-hide px-[30px] pt-[55px] pb-[0px]
    ${isColoredOutlet ? 'bg-gradient-blue' : 'bg-background'}
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

          <div className="h-[49px] w-full fixed bottom-0 left-1/2 -translate-x-1/2 sm:static sm:left-auto sm:translate-x-0 z-10">
            <NavigationBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
