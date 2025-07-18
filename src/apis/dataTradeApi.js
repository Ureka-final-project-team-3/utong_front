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

// 판매 주문 등록
export const postSellOrder = async (data) => {
  const res = await API.post('/data/sale', data);
  return res.data.data;
};

// 구매 주문 등록
export const postBuyOrder = async (data) => {
  const res = await API.post('/data/purchase', data);
  return res.data.data;
};

// 주문 취소
export const deleteOrder = async (orderId) => {
  const res = await API.delete(`/auction/orders/${orderId}`);
  return res.data.data;
};

// 판매 목록 조회
export const fetchSellList = async () => {
  const res = await API.get('/auction/sellList');
  return res.data.data;
};

// 구매 대기열 조회
export const fetchPendingList = async () => {
  const res = await API.get('/auction/pendingList');
  return res.data.data;
};

// 조건부 계약 등록
export const postConditionalContract = async (data) => {
  const res = await API.post('/auction/contract', data);
  return res.data.data;
};

// 가격 범위 조회
export const fetchPriceRange = async () => {
  const res = await API.get('/auction/priceRange');
  return res.data.data;
};
