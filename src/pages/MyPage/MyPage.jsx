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

export default function MyPage() {
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const [isMail, setIsMail] = useState(false);

  useEffect(() => {
    fetchMyInfo()
      .then((data) => setUser(data))
      .catch((error) => {
        console.error('유저 정보 불러오기 실패:', error);
        console.log('상세 응답:', error.response?.data); // 백엔드 에러 메시지 확인
      });
  }, []);

  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        credentials: 'include', // 쿠키도 필요하다면 유지
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

  if (!user) {
    return <SyncLoading />;
  }

  return (
    <div className="h-auto max-h-[650px] overflow-hidden text-black relative">
      {/* Header */}
      <div className="flex items-center gap-4 pt-5">
        <img src={utong} alt="유통이" className="w-[100px] h-auto" />
        <h1 className="text-white text-2xl font-bold">{user.name}</h1>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-[#386DEE] text-white rounded-xl p-3">
        <div className="flex justify-between items-start mb-2">
          {/* 판매 가능 데이터 */}
          <div className="w-full pr-1">
            <div className="flex items-center gap-1">
              <img src={dataIcon} alt="데이터 아이콘" className="w-5 h-5" />
              <div className="text-base">판매 가능 데이터</div>
            </div>
            <div className="text-base flex justify-between pl-6.5">
              <div>{user.dataCode === '002' ? '5G' : 'LTE'}</div>
              <div> {user.remainingData ?? 0}GB</div>
            </div>
          </div>

          {/* 포인트 */}
          <div className="w-full pl-2">
            <div className="flex items-center gap-1">
              <img src={pointIcon} alt="포인트 아이콘" className="w-5 h-5" />
              <div className="text-base ">포인트</div>
            </div>
            <div className="text-base text-right">{(user.mileage ?? 0).toLocaleString()}P</div>
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-3">
          <Link to="/chart" className="flex-1">
            <button className="w-full bg-[#1355E0] text-base text-white py-1 rounded-md hover:brightness-90 transition">
              거래하기
            </button>
          </Link>
          <Link to="/chargePage" className="flex-1">
            <button className="w-full bg-[#1355E0] text-base text-white py-1 rounded-md hover:brightness-90 transition">
              충전하기
            </button>
          </Link>
        </div>

        <div className="flex w-full">
          <img src={dataIcon} alt="데이터 아이콘" className="w-5 h-5" />
          <div className="w-full text-base pl-1">전체 데이터</div>
          <div className="w-full text-base text-right">{user.remainingData ?? 0}GB</div>
        </div>
      </div>

      {/* 메뉴 버튼들 */}
      <div className="grid grid-cols-4 gap-y-6 mt-10 text-center font-Medium text-xs text-[#5F5F5F]">
        {[
          { icon: Transcation, label: '거래 내역', path: '/tradehistory' },
          { icon: Couponbox, label: '쿠폰함', path: '/coupon' },
          { icon: storagebox, label: '보관함', path: '/storage' },
          { icon: Editinformation, label: '정보 수정', path: '/edit-profile' },
        ].map(({ icon, label, path }) => (
          <Link to={path} key={label}>
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
              <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1">
                <img src={icon} alt={label} className="w-[22px] h-[22px]" />
              </div>
              {label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-y-6 mt-8 px-5 text-center font-Medium text-xs text-[#5F5F5F]">
        <Link to="/alarm">
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
            <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1">
              <img src={Notificationbox} alt="알림함" className="w-[22px] h-[22px]" />
            </div>
            알림함
          </div>
        </Link>
        <Link to="/guide">
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
            <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1">
              <img src={ServiceGuide} alt="서비스 가이드" className="w-[22px] h-[22px]" />
            </div>
            서비스 가이드
          </div>
        </Link>
        <div onClick={() => setShowModal(true)}>
          <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
            <div className="w-14 h-14 rounded-full bg-[#386DEE] flex items-center justify-center mb-1">
              <img src={Notificationsettings} alt="알림 설정" className="w-[22px] h-[22px]" />
            </div>
            알림 설정
          </div>
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div ref={modalRef} className="bg-white rounded-xl p-6 w-60 shadow-lg">
            <h2 className="text-lg font-bold mb-4">백그라운드 알림</h2>
            <div className="flex justify-between items-center">
              <span>수신여부</span>
              <button
                onClick={handleToggle}
                className={`w-14 h-7 rounded-full p-1 focus:outline-none transition ${
                  isMail ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition ${
                    isMail ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로그아웃 */}
      <div className="mt-20 text-center">
        <button
          className="text-blue-600 cursor-pointer hover:underline transition"
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
        >
          로그아웃
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
