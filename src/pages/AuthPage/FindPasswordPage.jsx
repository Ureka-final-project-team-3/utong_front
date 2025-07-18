import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';
import utongLogo from '@/assets/image/utong2.png';
import Button from '../../components/common/Button.jsx';
import bgImage from '@/assets/image/background4.png'; // 배경 이미지 import

const FindPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handlePasswordResetRequest = async () => {
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
    }
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    return value;
  };

  // 엔터 키 처리 함수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePasswordResetRequest();
    }
  };

  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 w-full h-full flex justify-end items-center">
        <div
          className="
            w-full h-full
            sm:w-[360px] sm:h-[780px]
            bg-background shadow-xl relative flex flex-col px-[30px] pt-[55px] pb-[30px] overflow-y-auto
            sm:mr-[500px]
          "
        >
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
            className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />

          <label className="block text-sm font-bold text-gray-500 mb-1">휴대폰 번호</label>
          <input
            type="tel"
            placeholder="숫자만 입력"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />

          <div className="mt-auto">
            <Button
              onClick={handlePasswordResetRequest}
              className="w-full h-[40px] text-[14px] rounded-md"
            >
              비밀번호 재설정 메일 전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;
