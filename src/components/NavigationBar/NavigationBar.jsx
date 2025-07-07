import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import user from '../../assets/user.svg';
import graph from '../../assets/graph.svg';

const NavigationBar = () => {
  return (
    <div className="relative w-[360px] h-[85px]">
      {/* 네비게이션 바 */}
      <div className="absolute top-[15px] left-0 w-full h-[70px] bg-white shadow-[0_-4.9px_29.4px_rgba(0,0,0,0.25)]" />

      {/* 차트 아이콘 */}
      <Link to="/chart" className="absolute left-[16.94%] top-[37.65%] w-[34px] h-[34px] z-10">
        <img
          src={graph}
          alt="차트"
          className="w-full h-full drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
        />
      </Link>

      {/* 마이페이지 아이콘 */}
      <Link to="/mypage" className="absolute left-[75%] top-[36.47%] w-[34px] h-[34px] z-10">
        <img
          src={user}
          alt="마이페이지"
          className="w-full h-full drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
        />
      </Link>

      {/*  홈 버튼 */}
      <Link
        to="/"
        className="absolute left-1/2 top-0 transform -translate-x-1/2
                   w-[61.79px] h-[61.79px] rounded-full bg-white
                   shadow-[0_3.92px_3.92px_rgba(235,0,139,0.33)] z-20
                   flex items-center justify-center"
      >
        <img src={logo} alt="로고" className="w-[34px] h-[34px]" />
      </Link>
    </div>
  );
};

export default NavigationBar;
