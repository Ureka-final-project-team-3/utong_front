import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Transcation from '@/assets/icon/recipt.png';
import Couponbox from '@/assets/icon/Couponbox.svg';
import storagebox from '@/assets/icon/storagebox.svg';
import Editinformation from '@/assets/icon/Editinformation.svg';
import Notificationbox from '@/assets/icon/call.png';
import ServiceGuide from '@/assets/icon/ServiceGuide.svg';
import Notificationsettings from '@/assets/icon/Notificationsettings.svg';
import dataIcon from '@/assets/image/data.svg';
import pointIcon from '@/assets/image/point.svg';
import utong from '@/assets/image/MyPageutong.svg';

import { fetchline, patchDefaultLine } from '@/apis/lineApi';
import { fetchMyInfo } from '@/apis/mypageApi';

import SyncLoading from '@/components/Loading/SyncLoading';
import useAuth from '@/hooks/useAuth';

export default function MyPage() {
  const [lineMap, setLineMap] = useState([]);
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'line' or 'mail'
  const modalRef = useRef(null);
  const [isMail, setIsMail] = useState(false);
  const [selectedLine, setSelectedLine] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user && user.phoneNumber) {
      setSelectedLine(user.phoneNumber);
    }
  }, [user]);

  useEffect(() => {
    const loadLines = async () => {
      try {
        const lines = await fetchline();
        setLineMap(lines);

        const defaultLine = lines.find((line) => line.default);
        if (defaultLine) {
          setSelectedLine(defaultLine.phoneNumber);
        }
      } catch (err) {
        console.error('회선 정보 불러오기 실패:', err);
      }
    };

    loadLines();
  }, []);

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchMyInfo()
        .then(setUser)
        .catch((error) => console.error('유저 정보 불러오기 실패:', error));
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
      return { success: data.resultCode === 200, data };
    } catch (error) {
      console.error('API Error', error);
      return { success: false, data: null };
    }
  };

  // 모달 외부 클릭 감지를 위한 useEffect (모든 모달 타입에 적용)
  useEffect(() => {
    if (!showModal) return;

    // 메일 설정을 위한 API 호출 (메일 모달일 때만)
    if (modalType === 'mail') {
      const fetchSetting = async () => {
        const result = await apiRequest('/api/auth/mail-settings');
        if (result.success) {
          setIsMail(result.data.data.isMail);
        }
      };
      fetchSetting();
    }

    // 모든 모달에 대한 외부 클릭 감지
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, modalType]);

  const handleToggle = async () => {
    const result = await apiRequest('/api/auth/mail-settings/toggle', { method: 'POST' });
    if (result.success) {
      setIsMail(result.data.data.isMail);
      // toast.success(result.data.data.message);
    } else {
      // toast.error('알림 설정 변경 실패');
    }
  };

  if (authLoading || !user) return <SyncLoading />;

  const menuItems = [
    { icon: Transcation, label: '거래 내역', path: '/tradehistory' },
    { icon: Couponbox, label: '쿠폰함', path: '/coupon' },
    { icon: storagebox, label: '보관함', path: '/storage' },
    { icon: Editinformation, label: '내 정보', path: '/edit-profile' },
  ];

  const subMenuItems = [
    {
      icon: Notificationbox,
      label: '번호 선택',
      onClick: () => {
        setModalType('line');
        setShowModal(true);
      },
    },
    { icon: ServiceGuide, label: '서비스 가이드', path: '/guide' },
    {
      icon: Notificationsettings,
      label: '알림 설정',
      onClick: () => {
        setModalType('mail');
        setShowModal(true);
      },
    },
  ];

  return (
    <div>
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
        <h1 className="text-white text-2xl font-bold">{user.name}</h1>
      </div>

      {/* Info Card */}
      <div
        className={`mt-5 bg-[#386DEE] text-white rounded-xl p-3 transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] overflow-visible relative z-10 ${
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
              <div className="transition-all duration-500">
                {user.canSale === -1 ? '무제한' : `${user.canSale ?? 0}GB`}
              </div>
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
            {user.remainingData === -1 ? '무제한' : `${user.remainingData ?? 0}GB`}
          </div>
        </div>
      </div>

      {/* 메인 메뉴 */}
      <div className="grid grid-cols-4 gap-y-6 mt-10 text-center text-xs text-[#5F5F5F]">
        {menuItems.map(({ icon, label, path }) => (
          <Link to={path} key={label}>
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
              <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1">
                <img src={icon} alt={label} className="w-[22px] h-[22px]" />
              </div>
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* 서브 메뉴 */}
      <div className="grid grid-cols-3 gap-y-6 mt-8 px-5 text-center text-xs text-[#5F5F5F]">
        {subMenuItems.map(({ icon, label, path, onClick }) => {
          const Component = path ? Link : 'div';
          const props = path ? { to: path } : { onClick };
          return (
            <Component {...props} key={label}>
              <div className="flex flex-col items-center cursor-pointer hover:opacity-80">
                <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1">
                  <img src={icon} alt={label} className="w-[22px] h-[22px]" />
                </div>
                <span>{label}</span>
              </div>
            </Component>
          );
        })}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in">
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-6 w-64 shadow-xl animate-modal-slide-up"
          >
            {modalType === 'mail' ? (
              <>
                <h2 className="text-lg font-bold mb-4">백그라운드 메일</h2>
                <div className="flex justify-between items-center">
                  <span>수신여부</span>
                  <button
                    onClick={handleToggle}
                    className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ${
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
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-4">번호 선택</h2>
                <ul className="space-y-2 text-sm">
                  {lineMap.map(({ phoneNumber, lineId }) => (
                    <li
                      key={lineId}
                      className={`cursor-pointer px-3 py-2 rounded-md border ${
                        selectedLine === phoneNumber
                          ? 'bg-blue-100 text-blue-600 font-bold'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={async () => {
                        setSelectedLine(phoneNumber);
                        setShowModal(false);
                        try {
                          await patchDefaultLine(lineId);
                          const updatedUser = await fetchMyInfo();
                          setUser(updatedUser);
                          // toast.success('전화번호가 변경되었습니다.');
                        } catch {
                          // toast.error('전화번호 변경 실패');
                        }
                      }}
                    >
                      {phoneNumber}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* 로그아웃 */}
      <div className="mt-20 text-center">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('account');
            window.location.href = '/start';
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
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
