import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar/NavigationBar';

const DefaultLayout = () => {
  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[360px] h-[780px] bg-white shadow-xl flex flex-col overflow-hidden">
        {/* 정확히 네비게이션 바 높이(85px)를 제외한 Outlet 영역 */}
        <div className="[height:calc(780px-85px)] overflow-y-auto px-[30px] pt-[55px] pb-[30px] relative">
          <Outlet />
        </div>

        {/* 네비게이션 바 (고정 85px) */}
        <NavigationBar />
      </div>
    </div>
  );
};

export default DefaultLayout;
