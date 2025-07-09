import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar/NavigationBar';

const DefaultLayout = () => {
  const location = useLocation();
  const bgPages = ['/', '/event', '/mypage'];
  const isColoredOutlet = bgPages.includes(location.pathname);

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[360px] h-[780px] bg-white shadow-xl flex flex-col overflow-hidden relative">
        {/* Outlet 영역 - NavigationBar 높이(49px) 제외한 나머지 */}
        <div className="h-[731px] overflow-y-auto">
          <div
            className={`min-h-full px-[30px] pt-[20px] pb-[30px] ${
              isColoredOutlet ? 'bg-gradient-blue' : ''
            }`}
          >
            <Outlet />
          </div>
        </div>

        <div className="h-[49px]">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
