import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/mypage',
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

export const fetchMyInfo = async () => {
  const res = await API.get('/info');

  return res.data.data;
};

export const fetchPoint = async () => {
  const res = await API.get('/points');
  return res.data.data;
};

export const chargePoint = async (chargedAmount) => {
  const res = await API.post('/points/charge', { chargedAmount });
  return res.data.data;
};
