import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <div>
      <nav>
        <Link to="/chart">차트보는곳</Link>
        <Link to="/">홈 버튼</Link>
        <Link to="/mypage">마이페이지</Link>
      </nav>
    </div>
  );
};

export default NavigationBar;
