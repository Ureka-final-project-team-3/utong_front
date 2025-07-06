import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar/NavigationBar';

const DefaultLayout = () => {
  const location = useLocation();

  // 배경색이 필요한 Outlet 페이지들
  const bgPages = ['/', '/event', '/mypage'];
  const isColoredOutlet = bgPages.includes(location.pathname);

  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[360px] h-[780px] bg-white shadow-xl flex flex-col overflow-hidden">
        
        <div
  className={`h-[695px] overflow-y-auto px-[30px] pt-[55px] pb-[30px] relative ${
    isColoredOutlet ? 'bg-gradient' : ''
  }`}
>
  <Outlet />
</div>


        
        <NavigationBar />
      </div>
    </div>
  );
};

export default DefaultLayout;
