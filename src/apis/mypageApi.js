import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/mypage',
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

export const fetchMyInfo = async () => {
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
