import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';
import Button from '../../components/common/Button.jsx';
import utong2 from '@/assets/image/utong2.png';
import googleIcon from '@/assets/image/google.png';
import kakaoIcon from '@/assets/image/kakao.png';
import naverIcon from '@/assets/image/naver.png';
import bgImage from '@/assets/image/background4.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');
    const oauth = params.get('oauth');
    if (accessToken && oauth === 'success') {
      localStorage.setItem('accessToken', accessToken);

      const fetchUserInfo = async () => {
        try {
          const meResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const meData = await meResponse.json();
          if (meResponse.ok && meData.data) {
            localStorage.setItem('account', JSON.stringify(meData.data));
          }

          window.history.replaceState({}, document.title, '/login');

          navigate('/', { replace: true });
        } catch (error) {
          console.error('사용자 정보 조회 실패:', error);
          alert('로그인 처리 중 오류가 발생했습니다.');
        }
      };
      fetchUserInfo();
    }
  }, [location, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = '아이디를 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '유효한 이메일 형식을 입력해주세요.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.data && data.data.accessToken) {
        const { accessToken, refreshToken } = data.data;
        localStorage.setItem('accessToken', accessToken);

        const meResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const meData = await meResponse.json();

        if (meResponse.ok && meData.data) {
          localStorage.setItem('account', JSON.stringify(meData.data));
        }

        navigate('/');
      } else if (response.status === 401) {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        const errorMessage = data.message || (data.data && data.data.message) || '로그인 실패';
        alert(errorMessage);
      }
    } catch (err) {
      console.error('로그인 에러:', err);
      alert('네트워크 오류');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
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
            bg-white shadow-xl relative flex flex-col overflow-hidden
            sm:mr-[500px]
          "
        >
          <div className="flex-1 overflow-y-auto px-[30px] pt-[55px] pb-[30px] bg-background">
            <BackButton />

            <div className="flex justify-center mb-8">
              <img src={utong2} alt="로고" className="w-[100px] h-auto" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-sm font-bold mb-1">아이디</label>
                <input
                  type="email"
                  placeholder="이메일형식 입력"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
                />
                <p className="min-h-[5px] text-red-500 text-xs mt-[2px]">
                  {errors.email || '\u00A0'}
                </p>
              </div>

              <div>
                <label className="block text-gray-500 text-sm font-bold mb-1">비밀번호</label>
                <input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
                />
                <p className="min-h-[5px] text-red-500 text-xs mt-[2px]">
                  {errors.password || '\u00A0'}
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-6 mb-4">
              <Button onClick={handleLogin}>로그인</Button>
            </div>

            <div className="border-t border-gray-300 pt-4 text-sm text-gray-400 flex justify-center space-x-4 mb-4">
              <Link to="/find-id">아이디 찾기</Link>
              <Link to="/find-password">비밀번호 찾기</Link>
              <Link to="/signup">회원가입</Link>
            </div>

            <div className="flex justify-center space-x-6">
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/api/oauth2/authorization/google`}
                className="w-10 h-10 rounded-full flex justify-center items-center shadow bg-white"
              >
                <img src={googleIcon} alt="Google" className="w-10 h-10" />
              </a>
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/api/oauth2/authorization/kakao`}
                className="w-10 h-10 rounded-full flex justify-center items-center shadow bg-[#FEE500]"
              >
                <img src={kakaoIcon} alt="Kakao" className="w-10 h-10" />
              </a>
              <a
                href={`${import.meta.env.VITE_API_BASE_URL}/api/oauth2/authorization/naver`}
                className="w-10 h-10 rounded-full flex justify-center items-center shadow bg-[#03C75A]"
              >
                <img src={naverIcon} alt="Naver" className="w-10 h-10" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
