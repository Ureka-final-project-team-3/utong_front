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

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'passwordConfirm') setPasswordConfirm(value);
    if (field === 'nickname') setNickname(value);
    if (field === 'phone') setPhone(value);

    // 즉시 validation
    const newErrors = { ...errors };
    switch (field) {
      case 'email':
        if (!value) {
          newErrors.email = '아이디를 입력해주세요.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = '유효한 이메일 형식을 입력해주세요.';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = '비밀번호를 입력해주세요.';
        } else if (value.length < 8) {
          newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
        } else {
          delete newErrors.password;
        }
        if (passwordConfirm && value !== passwordConfirm) {
          newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        } else {
          delete newErrors.passwordConfirm;
        }
        break;
      case 'passwordConfirm':
        if (value !== password) {
          newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        } else {
          delete newErrors.passwordConfirm;
        }
        break;
      case 'nickname':
        if (!value) {
          newErrors.nickname = '닉네임을 입력해주세요.';
        } else {
          delete newErrors.nickname;
        }
        break;
      case 'phone':
        if (!value) {
          newErrors.phone = '전화번호를 입력해주세요.';
        } else if (!/^010-\d{4}-\d{4}$/.test(value)) {
          newErrors.phone = '010-1234-1234 형식으로 입력해주세요.';
        } else {
          delete newErrors.phone;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSignup = async () => {
    // 전체 validation 검사 함수 호출
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

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    }

    if (!phone) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(phone)) {
      newErrors.phone = '010-1234-1234 형식으로 입력해주세요.';
    }

    setErrors(newErrors);

    // error 있으면 return
    if (Object.keys(newErrors).length > 0) {
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
    <div className="min-h-screen flex flex-col pb-[70px]">
      <BackButton />

      <div className="flex justify-center mb-8">
        <img src={utong2} alt="로고" className="w-[100px] h-auto" />
      </div>

      <div className="space-y-4">
        {/* 이메일 */}
        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">아이디</label>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
          <p className="min-h-[5px] text-red-500 text-xs mt-[2px]">{errors.email || '\u00A0'}</p>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
          <p className="min-h-[5px] text-red-500 text-xs mt-[2px]">{errors.password || '\u00A0'}</p>
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 확인 입력"
            value={passwordConfirm}
            onChange={(e) => handleChange('passwordConfirm', e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
          <p className="min-h-[5px] text-red-500 text-xs mt-[2px]">
            {errors.passwordConfirm || '\u00A0'}
          </p>
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">닉네임</label>
          <input
            type="text"
            placeholder="닉네임 입력"
            value={nickname}
            onChange={(e) => handleChange('nickname', e.target.value)} // 여기!!
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
          <p className="min-h-[5px] text-red-500 text-xs mt-[2px]">{errors.nickname || '\u00A0'}</p>
        </div>

        {/* 휴대폰 번호 */}
        <div>
          <label className="block text-gray-500 text-sm font-bold mb-1">휴대폰 번호</label>
          <input
            type="tel"
            placeholder="010-1234-1234 형식"
            value={phone}
            onChange={(e) => handleChange('phone', e.target.value)} // 여기!!
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
          <p className="min-h-[5px] text-red-500 text-xs mt-[2px]">{errors.phone || '\u00A0'}</p>
        </div>
      </div>

      <div className="flex justify-center mt-6 mb-4">
        <Button onClick={handleSignup}>회원 가입</Button>
      </div>
    </div>
  );
};

export default SignupPage;
