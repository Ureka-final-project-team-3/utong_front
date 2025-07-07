import React, { useEffect, useState } from 'react';

const TestPage = () => {
  const [message, setMessage] = useState('로딩 중...');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/test`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch(() => setMessage('백엔드 연결 실패'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>✅ CICD 테스트 - 백엔드 응답:</h1>
      <p>{message}</p>
    </div>
  );
};

export default TestPage;
