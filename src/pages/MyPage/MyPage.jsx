import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Transcation from '@/assets/icon/Transcation.svg';
import Couponbox from '@/assets/icon/Couponbox.svg';
import storagebox from '@/assets/icon/storagebox.svg';
import Editinformation from '@/assets/icon/Editinformation.svg';
import Notificationbox from '@/assets/icon/Notificationbox.svg';
import ServiceGuide from '@/assets/icon/ServiceGuide.svg';
import Notificationsettings from '@/assets/icon/Notificationsettings.svg';
import dataIcon from '@/assets/image/data.svg';
import pointIcon from '@/assets/image/point.svg';
import utong from '@/assets/image/MyPageutong.svg';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchMyInfo } from '@/apis/mypageApi';
import SyncLoading from '@/components/Loading/SyncLoading';
import useAuth from '@/hooks/useAuth';

export default function MyPage() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef(null);
  const [isMail, setIsMail] = useState(false);
  const phoneNumbers = user?.phoneNumbers ?? ['010-1234-5678', '010-9876-5432'];
  const [selectedLine, setSelectedLine] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedLine(user.dataCode === '002' ? '5G' : 'LTE');
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchMyInfo()
        .then((data) => setUser(data))
        .catch((error) => {
          console.error('유저 정보 불러오기 실패:', error);
          console.log('상세 응답:', error.response?.data);
        });
    }

    setTimeout(() => setMounted(true), 100);
  }, [authUser, authLoading]);

  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
        ...options,
      });
      const data = await response.json();
      console.log('API Response:', data);
      return { success: data.resultCode === 200, data };
    } catch (error) {
      console.error('API Error', error);
      return { success: false, data: null };
    }
  };

  useEffect(() => {
    if (!showModal) return;

    const fetchSetting = async () => {
      const result = await apiRequest('/api/auth/mail-settings');
      if (result.success) {
        const mailStatus = result.data.data.isMail;
        setIsMail(mailStatus);
      }
    };
    fetchSetting();

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  const handleToggle = async () => {
    const result = await apiRequest('/api/auth/mail-settings/toggle', { method: 'POST' });
    if (result.success) {
      const mailStatus = result.data.data.isMail;
      setIsMail(mailStatus);
      toast.success(result.data.data.message);
    } else {
      toast.error('알림 설정 변경 실패');
    }
  };

  if (authLoading || !user) {
    return <SyncLoading />;
  }

  const menuItems = [
    { icon: Transcation, label: '거래 내역', path: '/tradehistory' },
    { icon: Couponbox, label: '쿠폰함', path: '/coupon' },
    { icon: storagebox, label: '보관함', path: '/storage' },
    { icon: Editinformation, label: '정보 수정', path: '/edit-profile' },
  ];

  const subMenuItems = [
    { icon: Notificationbox, label: '알림함', path: '/alarm' },
    { icon: ServiceGuide, label: '서비스 가이드', path: '/guide' },
    { icon: Notificationsettings, label: '알림 설정', onClick: () => setShowModal(true) },
  ];

  return (
    <div className="h-auto max-h-[650px] overflow-visible text-black relative">
      {/* Header */}
      <div
        className={`flex items-center gap-4 pt-5 transition-all duration-700 ${
          mounted ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
        }`}
      >
        <img
          src={utong}
          alt="유통이"
          className="w-[100px] h-auto transition-all duration-1000 hover:scale-110"
          style={{
            animation: mounted ? 'bounce-gentle 2s ease-in-out infinite' : 'none',
          }}
        />

        {user && (
          <div className="flex items-center gap-2 relative z-100">
            <h1
              className="text-white text-2xl font-bold cursor-pointer"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
              }}
            >
              {user.name}
            </h1>

            <svg
              className={`w-4 h-4 text-white transition-transform duration-300 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>

            {dropdownOpen && (
              <ul className="absolute top-full left-0 mt-1 bg-white rounded shadow-lg w-30 text-black text-[12px] z-[9999] border border-gray-200">
                {phoneNumbers.map((line) => (
                  <li
                    key={line}
                    className={`px-3 py-1 cursor-pointer hover:bg-blue-100 ${
                      selectedLine === line ? 'font-bold text-blue-600' : ''
                    }`}
                    onClick={() => {
                      setSelectedLine(line);
                      setDropdownOpen(false);
                    }}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div
        className={`mt-10 bg-[#386DEE] text-white rounded-xl p-3 transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] overflow-visible relative z-10 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          {/* 판매 가능 데이터 */}
          <div className="w-full pr-1">
            <div className="flex items-center gap-1">
              <img src={dataIcon} alt="데이터 아이콘" className="w-5 h-5" />
              <div className="text-base">판매 가능 데이터</div>
            </div>
            <div className="text-base flex justify-between pl-6.5">
              <div>{user.dataCode === '002' ? '5G' : 'LTE'}</div>
              <div className="transition-all duration-500"> {user.canSale ?? 0}GB</div>
            </div>
          </div>

          {/* 포인트 */}
          <div className="w-full pl-2">
            <div className="flex items-center gap-1">
              <img src={pointIcon} alt="포인트 아이콘" className="w-5 h-5" />
              <div className="text-base ">포인트</div>
            </div>
            <div className="text-base text-right transition-all duration-500">
              {(user.mileage ?? 0).toLocaleString()}P
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-3">
          <Link to="/chart" className="flex-1">
            <button className="w-full bg-[#1355E0] text-base text-white py-1 rounded-md hover:brightness-90 hover:scale-105 transition-all duration-300">
              거래하기
            </button>
          </Link>
          <Link to="/chargePage" className="flex-1">
            <button className="w-full bg-[#1355E0] text-base text-white py-1 rounded-md hover:brightness-90 hover:scale-105 transition-all duration-300">
              충전하기
            </button>
          </Link>
        </div>

        <div className="flex w-full">
          <img src={dataIcon} alt="데이터 아이콘" className="w-5 h-5" />
          <div className="w-full text-base pl-1">전체 데이터</div>
          <div className="w-full text-base text-right transition-all duration-500">
            {user.remainingData ?? 0}GB
          </div>
        </div>
      </div>

      {/* 메뉴 버튼들 */}
      <div
        className={`grid grid-cols-4 gap-y-6 mt-10 text-center font-Medium text-xs text-[#5F5F5F] transition-all duration-700 delay-400 relative z-10 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {menuItems.map(({ icon, label, path }, index) => (
          <Link to={path} key={label}>
            <div
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-all duration-300 group"
              style={{
                animation: mounted ? `slide-up 0.6s ease-out ${index * 0.1}s both` : 'none',
              }}
            >
              <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-lg">
                <img
                  src={icon}
                  alt={label}
                  className="w-[22px] h-[22px] transition-transform duration-300"
                />
              </div>
              <span className="group-hover:text-[#386DEE] transition-colors duration-300">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div
        className={`grid grid-cols-3 gap-y-6 mt-8 px-5 text-center font-Medium text-xs text-[#5F5F5F] transition-all duration-700 delay-600 relative z-10 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {subMenuItems.map(({ icon, label, path, onClick }, index) => {
          const Component = path ? Link : 'div';
          const props = path ? { to: path } : { onClick };

          return (
            <Component {...props} key={label}>
              <div
                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-all duration-300 group"
                style={{
                  animation: mounted ? `slide-up 0.6s ease-out ${(index + 4) * 0.1}s both` : 'none',
                }}
              >
                <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-lg">
                  <img
                    src={icon}
                    alt={label}
                    className="w-[22px] h-[22px] transition-transform duration-300"
                  />
                </div>
                <span className="group-hover:text-[#386DEE] transition-colors duration-300">
                  {label}
                </span>
              </div>
            </Component>
          );
        })}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-6 w-60 shadow-lg animate-modal-slide-up"
          >
            <h2 className="text-lg font-bold mb-4">백그라운드 알림</h2>
            <div className="flex justify-between items-center">
              <span>수신여부</span>
              <button
                onClick={handleToggle}
                className={`w-14 h-7 rounded-full p-1 focus:outline-none transition-all duration-300 ${
                  isMail ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition-all duration-300 ${
                    isMail ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로그아웃 */}
      <div
        className={`mt-20 text-center transition-all duration-700 delay-800 ${
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <button
          className="text-blue-600 cursor-pointer hover:underline hover:scale-105 transition-all duration-300"
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('account');
            window.location.href = '/start';
          }}
        >
          로그아웃
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-5px) rotate(2deg);
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes modal-slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-modal-slide-up {
          animation: modal-slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
