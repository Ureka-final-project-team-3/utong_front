import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import tongtong2 from '@/assets/image/tongtong2.png';
import trade from '@/assets/icon/trade.png';
import shop from '@/assets/icon/shop.png';
import event from '@/assets/icon/event.png';
import wifi from '@/assets/icon/wifi.png';
import coin from '@/assets/icon/coin.png';

import { fetchMyInfo } from '@/apis/mypageApi';

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const accountData = localStorage.getItem('account');
    if (accountData && accountData !== 'undefined') {
      setUser(JSON.parse(accountData));
    }
  }, []);
  useEffect(() => {
    fetchMyInfo()
      .then((data) => setUserInfo(data))
      .catch((err) => console.error('메인페이지 유저 정보 불러오기 실패:', err));
  }, []);
  return (
    <div>
      <div className="flex w-[300px] mt-8 items-start">
        <div className="text-white text-left mr-2">
          <p className="text-[24px] font-semibold leading-tight">{user?.nickname || '게스트'}님,</p>
          <p className="text-[24px] font-semibold leading-tight">안녕하세요!</p>
        </div>

        <img src={tongtong2} alt="통통이" className="w-[160px] h-[160px]" />
      </div>

      <div className="flex justify-between w-[300px] mt-4 space-x-3">
        <div className="flex flex-col justify-between bg-white rounded-xl shadow p-2 flex-1 h-[60px]">
          <div className="flex items-center">
            <img src={wifi} alt="데이터" className="w-[23px] h-[16px] mr-1" />
            <p className="text-xs text-gray-500">데이터</p>
          </div>
          <p className="text-sm font-bold self-end">
            <span className="text-blue-600">{userInfo?.remainingData ?? 0}</span>GB
          </p>
        </div>

        <div className="flex flex-col justify-between bg-blue-100 rounded-xl shadow p-2 flex-1 h-[60px]">
          <div className="flex items-center">
            <img src={coin} alt="포인트" className="w-[20px] h-[20px] mr-1" />
            <p className="text-xs text-gray-500">포인트</p>
          </div>
          <p className="text-sm font-bold self-end">
            <span className="text-blue-600">{(userInfo?.mileage ?? 0).toLocaleString()}</span>P
          </p>
        </div>
      </div>

      <div className="rounded-xl text-white p-4 mt-4 bg-gradient-market-price w-[300px] h-[80px]">
        <div className="flex flex-col justify-between h-full">
          <p className="text-[14px] font-bold text-left">실시간 데이터 거래가격</p>

          <p className="text-right leading-5 self-end">
            <span className="text-[10px]">현재 </span>
            <span className="text-[24px] font-bold">8700원</span>
            <span className="text-[10px]"> (1GB)</span>
          </p>
        </div>
      </div>
      <div
        className="w-[300px] mx-auto mt-6 rounded-3xl overflow-hidden bg-white"
        style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)' }}
      >
        <Link to="/chart" className="block">
          <div className="flex items-center justify-between pl-6 pr-4 py-4">
            <div className="flex items-center space-x-3">
              <img src={trade} alt="거래하기" className="w-5 h-5" />
              <span className="font-bold text-[16px] leading-[20px] pl-2">데이터 거래하기</span>
            </div>
            <span className="text-gray-400 pr-4">{'>'}</span>
          </div>
        </Link>

        <div className="border-t border-gray-200" />

        <Link to="/event" className="block">
          <div className="flex items-center justify-between pl-6 pr-4 py-4">
            <div className="flex items-center space-x-3">
              <img src={event} alt="이벤트" className="w-5 h-5" />
              <span className="font-bold text-[16px] leading-[20px] pl-2">이벤트</span>
            </div>
            <span className="text-gray-400 pr-4">{'>'}</span>
          </div>
        </Link>

        <div className="border-t border-gray-200" />

        <Link to="/shop" className="block">
          <div className="flex items-center justify-between pl-6 pr-4 py-4">
            <div className="flex items-center space-x-3">
              <img src={shop} alt="상점" className="w-5 h-5" />
              <span className="font-bold text-[16px] leading-[20px] pl-2">포인트 상점</span>
            </div>
            <span className="text-gray-400 pr-4">{'>'}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
