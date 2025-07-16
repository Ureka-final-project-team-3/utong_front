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

export const fetchGifticons = async () => {
  const res = await API.get('/gifticons');
  return res.data.data;
};

export const fetchGifticonDetail = async (gifticonId) => {
  const res = await API.post('/gifticons/detail', { gifticonId });
  return res.data.data;
};

export const fetchCoupons = async () => {
  const res = await API.get('/coupons');
  console.log('🟢 쿠폰 응답:', res.data); // 응답 로그
  return res.data.data;
};
