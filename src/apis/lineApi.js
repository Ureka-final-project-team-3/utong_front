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

export const fetchline = async () => {
  const res = await API.get('/lines');
  return res.data.data;
};

export const patchDefaultLine = async (lineId) => {
  try {
    const response = await API.patch('/lines', {
      lineId,
    });
    return response.data.data;
  } catch (error) {
    console.error('기본 회선 설정 실패:', error);
    throw error;
  }
};
