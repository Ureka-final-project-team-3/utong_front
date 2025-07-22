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

export const fetchRouletteEventStatus = async () => {
  const res = await API.get('/roulette/event');
  return res.data;
};

export const participateInRoulette = async (eventId) => {
  const res = await API.post('/roulette/participate', { eventId });
  console.log('룰렛 참여 응답:', res.data);  // 여기서 쿠폰 데이터 구조 확인
  return res.data;
};

export const createOrUpdateRouletteEvent = async (eventData) => {
  const res = await API.post('/admin/roulette/event', eventData);
  return res.data;
};
