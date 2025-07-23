import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/user',
  withCredentials: true,
});
// 요청 인터셉터 추가
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// 1단계: 먼저 쿠키가 실제로 저장되었는지 확인
// 2단계: refreshToken 함수를 fetch로 완전히 교체
export const refreshToken = async () => {
  const refreshURL = import.meta.env.VITE_API_BASE_URL + '/api/auth/refresh';
  try {
    const response = await fetch(refreshURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Refresh failed:', errorData);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};
export const fetchMyInfo = async () => {
  const res1 = await refreshToken();
  if (res1.accessToken !== null) {
    localStorage.setItem('accessToken', res1.accessToken);
  }
  const res = await API.get('/info');
  return res.data.data;
};
export const fetchPoint = async () => {
  const res = await API.get('/points');
  return res.data.data;
};
export const chargePoint = async ({ chargedAmount, userCouponId }) => {
  const payload = { chargedAmount };
  if (userCouponId) payload.userCouponId = userCouponId;
  const res = await API.post('/points/charge', payload);
  return res.data.data;
};
export const fetchCoupons = async () => {
  const res = await API.get('/coupons');
  return res.data.data;
};
export const fetchCouponUse = async (userCouponId) => {
  const res = await API.post('/coupons', {
    userCouponId,
  });
  return res.data.data;
};
