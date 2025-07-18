import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';
import utongLogo from '@/assets/image/utong2.png';
import Button from '../../components/common/Button.jsx';
import bgImage from '@/assets/image/background4.png'; // 배경 이미지 import

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!password || !passwordConfirm) {
      alert('비밀번호를 모두 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: password,
          confirmPassword: passwordConfirm,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.resultCode !== 200) {
        alert(result.message || '비밀번호 변경에 실패했습니다.');
        return;
      }

      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/login');
    } catch (error) {
      console.error('API 호출 오류:', error);
      alert('비밀번호 변경에 실패했습니다.');
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
            bg-background shadow-xl relative flex flex-col overflow-y-auto
            sm:mr-[500px] px-[30px] pt-[55px] pb-[30px]
          "
        >
          <BackButton />

          {/* 로고 */}
          <div className="flex justify-center mb-8">
            <img src={utongLogo} alt="로고" className="w-[100px] h-auto" />
          </div>

          <label className="block text-sm font-bold text-gray-500 mb-1">비밀번호 재설정</label>
          <input
            type="password"
            placeholder="8자 이상"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />

          <label className="block text-sm font-bold text-gray-500 mb-1">비밀번호 재설정 확인</label>
          <input
            type="password"
            placeholder="8자 이상"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />

          <Button onClick={handleResetPassword}>비밀번호 변경하기</Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
