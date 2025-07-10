import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';
// import backIcon from '../../assets/icon/back.svg';
import Button from '../../components/common/Button.jsx';
import utong2 from '../../assets/image/utong2.png';
import googleIcon from '../../assets/image/google.png';
import kakaoIcon from '../../assets/image/kakao.png';
import naverIcon from '../../assets/image/naver.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        alert('로그인 성공!');
        navigate('/'); // 로그인 성공 후 메인 페이지로 이동
      } else {
        alert(data.message || '로그인 실패');
      }
    } catch (err) {
      console.error('로그인 에러:', err);
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
        {/* 아이디 */}
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

        {/* 비밀번호 */}
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
      </div>

      {/* 로그인 버튼 */}
      <div className="flex justify-center mt-6 mb-4">
        <Button onClick={handleLogin}>로그인</Button>
      </div>

      <div className="border-t border-gray-300 pt-4 text-sm text-gray-400 flex justify-center space-x-4 mb-4">
        <Link to="/find-id">아이디 찾기</Link>
        <Link to="/find-password">비밀번호 찾기</Link>
        <Link to="/signup">회원가입</Link>
      </div>

      {/* 소셜 로그인 */}
      <div className="flex justify-center space-x-6">
        <a
          href="http://localhost:8080/oauth2/authorization/google"
          className="w-10 h-10 rounded-full flex justify-center items-center shadow bg-white"
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5" />
        </a>
        <a
          href="http://localhost:8080/oauth2/authorization/kakao"
          className="w-10 h-10 rounded-full flex justify-center items-center shadow bg-[#FEE500]"
        >
          <img src={kakaoIcon} alt="Kakao" className="w-5 h-5" />
        </a>
        <a
          href="http://localhost:8080/oauth2/authorization/naver"
          className="w-10 h-10 rounded-full flex justify-center items-center shadow bg-[#03C75A]"
        >
          <img src={naverIcon} alt="Naver" className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
