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

export const fetchGifticons = async () => {
  const res = await API.get('/gifticons');
  return res.data.data;
};

export const fetchGifticonDetail = async (gifticonId) => {
  const res = await API.post('/gifticons', { gifticonId });
  return res.data.data;
};
