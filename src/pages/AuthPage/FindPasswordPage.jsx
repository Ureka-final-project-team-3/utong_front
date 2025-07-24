import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';
import utongLogo from '@/assets/image/utong2.png';
import Button from '../../components/common/Button.jsx';
import bgImage from '@/assets/image/background4.png'; // 배경 이미지 import

const FindPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordResetRequest = async () => {
    setIsLoading(true); // 로딩 시작

    try {
      const formattedPhone = formatPhoneNumber(phone);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phoneNumber: formattedPhone }),
        }
      );

      const result = await response.json();

      if (response.ok && result.resultCode === 200) {
        alert('비밀번호 재설정 메일이 전송되었습니다.');
        navigate('/login');
      } else {
        alert(result.message || '비밀번호 찾기에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert('비밀번호 찾기에 실패했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    return value;
  };

  // 전화번호 입력 시 자동 포맷팅
  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // 기존 하이픈 제거하고 숫자만 추출
    const digits = value.replace(/\D/g, '');

    // 최대 11자리까지만 허용
    const limitedDigits = digits.slice(0, 11);

    // 자동 포맷팅
    let formattedValue = '';
    if (limitedDigits.length <= 3) {
      formattedValue = limitedDigits;
    } else if (limitedDigits.length <= 7) {
      formattedValue = `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3)}`;
    } else {
      formattedValue = `${limitedDigits.slice(0, 3)}-${limitedDigits.slice(3, 7)}-${limitedDigits.slice(7)}`;
    }

    setPhone(formattedValue);
  };

  // 엔터 키 처리 함수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handlePasswordResetRequest();
    }
  };

  return (
    <>
      <div>
        <div>
          <div>
            <BackButton />

            {/* 로고 */}
            <div className="flex justify-center mb-8">
              <img src={utongLogo} alt="로고" className="w-[100px] h-auto" />
            </div>

            <label className="block text-sm font-bold text-gray-500 mb-1">아이디 입력</label>
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none disabled:opacity-50"
            />

            <label className="block text-sm font-bold text-gray-500 mb-1">휴대폰 번호</label>
            <input
              type="tel"
              placeholder="전화번호를 입력해주세요"
              value={phone}
              onChange={handlePhoneChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none disabled:opacity-50"
            />

            <div className="mt-auto">
              <Button
                onClick={handlePasswordResetRequest}
                disabled={isLoading}
                className="w-full h-[40px] text-[14px] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '전송 중...' : '비밀번호 재설정 메일 전송'}
              </Button>
            </div>

            {/* 로딩 모달 */}
            {isLoading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in">
                <div className="bg-white rounded-xl p-6 w-60 shadow-lg animate-modal-slide-up flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-700 text-center">잠시만 기다려주세요...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 애니메이션 스타일 */}
      <style jsx>{`
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
    </>
  );
};

export default FindPasswordPage;
