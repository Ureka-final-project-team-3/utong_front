import React from 'react';
import { Link } from 'react-router-dom';

import logo from '@/assets/icon/logo.svg';
import graph from '@/assets/icon/graph.svg';
import user from '@/assets/icon/user.svg';
import alarm from '@/assets/icon/alarm.svg';
import shop from '@/assets/icon/shop.svg';

const icons = [
  { to: '/chart', src: graph, alt: '차트' },
  { to: '/charge', src: shop, alt: '포인트 상점' },
  { to: '/', src: logo, alt: '홈' },
  { to: '/alarm', src: alarm, alt: '알람' },
  { to: '/mypage', src: user, alt: '마이페이지' },
];

const NavIcon = ({ to, src, alt }) => (
  <Link to={to}>
    <img src={src} alt={alt} className="w-[20px] h-[20px]" />
  </Link>
);

const NavigationBar = () => {
  return (
    <div className="w-[360px] h-[49px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.25)] flex items-center justify-between px-[30px]">
      {icons.map((icon) => (
        <NavIcon key={icon.to} {...icon} />
      ))}
    </div>
  );
};

export default NavigationBar;
