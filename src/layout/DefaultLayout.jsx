import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar/NavigationBar';
import bgImage from '@/assets/image/background3.png';
import { AnimatePresence, motion } from 'framer-motion';

const DefaultLayout = () => {
  const location = useLocation();
  const bgPages = ['/', '/event', '/mypage'];
  const isColoredOutlet = bgPages.includes(location.pathname);

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 앱 내용 영역 */}
      <div className="relative z-10 w-full h-full flex justify-end items-center">
        <div
          className={`
            w-full h-full
            sm:w-[360px] sm:h-[780px]
            bg-white shadow-xl relative flex flex-col overflow-hidden
            sm:mr-[500px]
          `}
        >
          <div
            className={`
              flex-1 overflow-y-auto px-[30px] pt-[55px] pb-[30px]
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
