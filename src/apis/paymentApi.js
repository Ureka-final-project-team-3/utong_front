import axios from 'axios';

const paymentAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/payments',
  withCredentials: true,
});

paymentAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const confirmTossPayment = async ({ paymentKey, orderId, amount, userCouponId }) => {
  const payload = { paymentKey, orderId, amount };
  if (userCouponId) payload.userCouponId = userCouponId;

  const res = await paymentAPI.post('/confirm', payload);
  return res.data;
};
