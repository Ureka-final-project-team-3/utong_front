import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';
import utongLogo from '@/assets/image/utong2.png';
import Button from '../../components/common/Button.jsx';

const FindPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handlePasswordResetRequest = async () => {
    try {
      const formattedPhone = formatPhoneNumber(phone);
      console.log('payload:', { email, phoneNumber: formattedPhone });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phoneNumber: formattedPhone }),
        }
      );

      console.log('response status:', response.status);

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const result = await response.json();
      if (result.resultCode === 200) {
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

  // formatPhoneNumber 함수 정의:
  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
    return value;
  };

  return (
    <div className="w-screen min-h-[100dvh] bg-gray-200 flex justify-center items-center">
      <div
        className="
          w-full h-[100dvh]
          sm:w-[360px] sm:h-[780px]
          bg-gray-100 relative flex flex-col px-[30px] pt-[55px] pb-[30px]
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
          className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
        />

        <label className="block text-sm font-bold text-gray-500 mb-1">휴대폰 번호</label>
        <input
          type="tel"
          placeholder="숫자만 입력"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
        />

        <div className="w-[300px] h-[35px]">
          <Button onClick={handlePasswordResetRequest}>
            <span className="text-[14px]">비밀번호 재설정 메일 전송</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FindPasswordPage;
