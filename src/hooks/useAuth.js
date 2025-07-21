import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accountData = localStorage.getItem('account');

    if (!accountData || accountData === 'undefined') {
      navigate('/start'); // 로그인 안되어 있으면 로그인 페이지로 이동
    } else {
      setUser(JSON.parse(accountData));
    }

    setIsLoading(false);
  }, [navigate]);

  return { user, isLoading };
};

export default useAuth;
