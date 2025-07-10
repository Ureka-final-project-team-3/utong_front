import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';

import Button from '../../components/common/Button.jsx';
import utong2 from '../../assets/image/utong2.png';

const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignup = async () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nickname,
          phoneNumber: phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('회원가입 성공!');
        navigate('/login');
      } else {
        alert(data.message || '회원가입 실패');
      }
    } catch (err) {
      console.error('회원가입 에러:', err);
      alert('네트워크 오류');
    }
  };

  return (
    <div className="h-screen bg-[#F6F7FC] pt-[55px] px-[30px] relative">
      <BackButton />

      {/* 로고 */}
      <div className="flex justify-center mb-8">
        <img src={utong2} alt="로고" className="w-[100px] h-auto" />
      </div>

      {/* 폼 입력 */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">아이디</label>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 확인 입력을 해주세요."
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">닉네임</label>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">휴대폰 번호</label>
          <input
            type="tel"
            placeholder="010-1234-1234의 형식으로 입력해주세요."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <div className="flex justify-center mt-6 mb-4">
        <Button onClick={handleSignup}>회원 가입</Button>
      </div>
    </div>
  );
};

export default SignupPage;
