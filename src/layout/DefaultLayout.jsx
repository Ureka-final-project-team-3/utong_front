import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar/NavigationBar';

const DefaultLayout = () => {
  const location = useLocation();
  const bgPages = ['/', '/event', '/mypage'];
  const isColoredOutlet = bgPages.includes(location.pathname);

  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center overflow-hidden">
      {/* 고정된 모바일 프레임 */}
      <div
        className="
          w-full h-full 
          sm:w-[360px] sm:h-[780px]
          bg-white shadow-xl relative flex flex-col overflow-hidden
        "
      >
        {/* 스크롤이 생기는 내부 콘텐츠 영역 */}
        <div
          className={`
            flex-1 overflow-y-auto px-[30px] pt-[55px] pb-[30px] 
            ${isColoredOutlet ? 'bg-gradient-blue' : 'bg-background'}
          `}
        >
          <Outlet />
        </div>

        {/* 고정된 하단 네비게이션 */}
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
