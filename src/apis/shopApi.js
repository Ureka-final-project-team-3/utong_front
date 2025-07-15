import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// /api/gifticons GET 요청 함수
export const fetchAllGifticons = async () => {
  const res = await API.get('/gifticons');
  return res.data.data;
};

export const fetchGifticonDetail = async (gifticonId) => {
  const res = await API.get(`/gifticons/${gifticonId}`);
  return res.data.data; // 응답 구조에 따라 조정
};

export const exchangeGifticon = async (gifticonId) => {
  const res = await API.post(`/gifticons/${gifticonId}/exchange`);
  return res.data.data; // 응답 구조에 따라 필요 시 조정
};
