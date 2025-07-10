import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar/NavigationBar';

const DefaultLayout = () => {
  const location = useLocation();
  const bgPages = ['/', '/event', '/mypage'];
  const isColoredOutlet = bgPages.includes(location.pathname);

  return (
    <div className="w-screen min-h-[100dvh] bg-gray-200 flex justify-center items-center">
      <div
        className={`
          w-full h-[100dvh]
          sm:w-[360px] sm:h-[780px]
          bg-white shadow-xl relative flex flex-col
        `}
      >
        {/* Main content (scrollable) */}
        <div
          className={`flex-1 overflow-y-auto px-[30px] pt-[20px] pb-[70px] ${
            isColoredOutlet ? 'bg-gradient-blue' : ''
          }`}
        >
          <Outlet />
        </div>

        {/* NavigationBar (fixed on mobile, static on desktop) */}
        <div
          className="
  h-[49px] w-full
  fixed bottom-0 left-1/2 -translate-x-1/2
  sm:static sm:left-auto sm:translate-x-0
  z-10
"
        >
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
