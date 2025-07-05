import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar/NavigationBar';

const DefaultLayout = () => {
  return (
    <div className="w-screen h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[360px] h-[780px] bg-white  shadow-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <NavigationBar />
      </div>
    </div>
  );
};

export default DefaultLayout;
