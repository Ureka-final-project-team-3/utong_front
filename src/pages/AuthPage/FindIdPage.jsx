import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton.jsx';
import utongLogo from '@/assets/image/utong2.png';
import Button from '../../components/common/Button.jsx';

const FindIdPage = () => {
  const [phone, setPhone] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const navigate = useNavigate();

  const handleFindId = async () => {
    try {
      console.log('전송할 데이터:', { phoneNumber: phone }); // 디버깅용

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/find-account`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }), // 여기만 수정!
      });

      console.log('response status:', response.status);

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const result = await response.json();
      console.log('응답 결과:', result);

      if (result.resultCode === 200 && result.data?.maskedEmail) {
        setFoundEmail(result.data.maskedEmail);
      } else {
        setFoundEmail('');
        alert(result.message || '일치하는 정보가 없습니다.');
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      setFoundEmail('');
      alert('아이디 찾기에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="w-screen min-h-[100dvh] bg-gray-400 flex justify-center items-center">
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

        {/* 휴대폰 번호 입력 */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-500 mb-1">휴대폰 번호</label>
          <input
            type="tel"
            placeholder="010-1234-1234 형식으로 입력"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-gray-200 placeholder-gray-400 focus:outline-none"
          />
        </div>

        {/* 아이디 찾기 버튼 */}
        <div className="mb-4">
          <Button onClick={handleFindId}>아이디 찾기</Button>
        </div>

        {/* 찾은 아이디 표시 */}
        {foundEmail && (
          <div className="flex justify-between items-center bg-gray-300 rounded-md px-4 py-3 mb-4">
            <span className="text-gray-500 text-sm font-semibold">아이디</span>
            <span className="text-black text-sm font-medium">{foundEmail}</span>
          </div>
        )}

        {/* 로그인 하러가기 버튼 */}
        {foundEmail && (
          <div className="mt-auto">
            <Button onClick={() => navigate('/login')}>로그인 하기</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindIdPage;
