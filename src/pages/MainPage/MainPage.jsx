import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import tongtong2 from '@/assets/image/tongtong2.png';
import trade from '@/assets/icon/trade.png';
import shop from '@/assets/icon/shop.png';
import event from '@/assets/icon/event.png';
import wifi from '@/assets/icon/wifi.png';
import coin from '@/assets/icon/coin.png';
import { useLocation } from 'react-router-dom';
import { fetchMyInfo } from '@/apis/mypageApi';
import useAuth from '@/hooks/useAuth';
const MainPage = () => {
  const { user, isLoading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(8700);
  const location = useLocation();
  useEffect(() => {
    console.log('App.jsx - 현재 URL:', window.location.href);
    console.log('App.jsx - location.search:', location.search);
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const oauth = params.get('oauth');
    console.log('OAuth 파라미터 확인:', { accessToken: !!accessToken, oauth });
    if (accessToken && oauth === 'success') {
      console.log('OAuth 로그인 성공, 토큰 저장');
      localStorage.setItem('accessToken', accessToken);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            localStorage.setItem('account', JSON.stringify(data.data));
          }
          window.history.replaceState({}, document.title, '/');
          window.location.reload();
        })
        .catch((error) => {
          console.error('사용자 정보 조회 실패:', error);
        });
    }
  }, [location.search]);
  useEffect(() => {
    if (!isLoading && user) {
      fetchMyInfo()
        .then((data) => setUserInfo(data))
        .catch((err) => console.error('메인페이지 유저 정보 불러오기 실패:', err));
    }
    // 마운트 애니메이션 시작
    setTimeout(() => setMounted(true), 100);
  }, [user, isLoading]);
  // 실시간 가격 애니메이션 효과
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 201) - 100; // -100 ~ +100
      setCurrentPrice((prev) => Math.max(8000, Math.min(10000, prev + change)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  if (isLoading) {
    return null;
  }
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 환영 메시지와 캐릭터 */}
      <div
        className={`flex w-[300px] mt-4 items-start transition-all duration-700 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="text-white text-left mr-2">
          <p className="text-[24px] font-semibold leading-tight">{user?.nickname || '게스트'}님,</p>
          <p className="text-[24px] font-semibold leading-tight">안녕하세요!</p>
        </div>
        <img
          src={tongtong2}
          alt="통통이"
          className={`w-[160px] h-[160px] transition-all duration-1000 ${
            mounted ? 'scale-100 rotate-0' : 'scale-75 -rotate-12'
          }`}
          style={{
            animation: mounted ? 'float 3s ease-in-out infinite' : 'none',
          }}
        />
      </div>
      {/* 데이터/포인트 카드 */}
      <div
        className={`flex justify-between w-[300px] mt-2 space-x-3 transition-all duration-700 delay-200 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex flex-col justify-between bg-white rounded-xl shadow p-2 flex-1 h-[60px] hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <img src={wifi} alt="데이터" className="w-[23px] h-[16px] mr-1" />
            <p className="text-xs text-gray-500">데이터</p>
          </div>
          <p className="text-sm font-bold self-end">
            <span className="text-blue-600 transition-all duration-500">
              {userInfo?.remainingData ?? 0}
            </span>
            GB
          </p>
        </div>
        <div className="flex flex-col justify-between bg-blue-100 rounded-xl shadow p-2 flex-1 h-[60px] hover:shadow-lg hover:scale-105 transition-all duration-300">
          <div className="flex items-center">
            <img src={coin} alt="포인트" className="w-[20px] h-[20px] mr-1" />
            <p className="text-xs text-gray-500">포인트</p>
          </div>
          <p className="text-sm font-bold self-end">
            <span className="text-blue-600 transition-all duration-500">
              {(userInfo?.mileage ?? 0).toLocaleString()}
            </span>
            P
          </p>
        </div>
      </div>
      {/* 실시간 가격 카드 */}
      <div
        className={`rounded-xl text-white p-4 mt-5 bg-gradient-market-price w-[300px] h-[80px] transition-all duration-700 delay-300 hover:shadow-xl hover:scale-[1.02] ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <p className="text-[14px] font-bold text-left">실시간 데이터 거래가격</p>
          <p className="text-right leading-5 self-end">
            <span className="text-[10px]">현재 </span>
            <span className="text-[24px] font-bold transition-all duration-500">
              {currentPrice.toLocaleString()}원
            </span>
            <span className="text-[10px]"> (1GB)</span>
          </p>
        </div>
      </div>
      {/* 메뉴 카드 */}
      <div
        className="w-[290px] mx-auto mt-8 rounded-3xl overflow-hidden bg-white flex-shrink-0"
        style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.25)' }}
      >
        <Link to="/chart" className="block transition-transform duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between pl-6 pr-4 py-4">
            <div className="flex items-center space-x-3">
              <img src={trade} alt="거래하기" className="w-5 h-5" />
              <span className="font-bold text-[16px] leading-[20px] pl-2">데이터 거래하기</span>
            </div>
            <span className="text-gray-400 pr-4">{'>'}</span>
          </div>
        </Link>
        <div className="border-t border-gray-200" />
        <Link to="/event" className="block transition-transform duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between pl-6 pr-4 py-4">
            <div className="flex items-center space-x-3">
              <img src={event} alt="이벤트" className="w-5 h-5" />
              <span className="font-bold text-[16px] leading-[20px] pl-2">이벤트</span>
            </div>
            <span className="text-gray-400 pr-4">{'>'}</span>
          </div>
        </Link>
        <div className="border-t border-gray-200" />
        <Link to="/shop" className="block transition-transform duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between pl-6 pr-4 py-4">
            <div className="flex items-center space-x-3">
              <img src={shop} alt="상점" className="w-5 h-5" />
              <span className="font-bold text-[16px] leading-[20px] pl-2">포인트 상점</span>
            </div>
            <span className="text-gray-400 pr-4">{'>'}</span>
          </div>
        </Link>
      </div>
      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        @keyframes pulse-price {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};
export default MainPage;
