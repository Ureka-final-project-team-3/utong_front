import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  withCredentials: true,
});

// 요청 인터셉터
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 구매 데이터 조회 (기본 1주일)
export const fetchPurchaseData = async (range = 'WEEK') => {
  const res = await API.get(`/data/purchase?range=${range}`);
  const result = res.data?.data;
  console.log('구매 데이터:', result);
  return Array.isArray(result) ? result : []; // 방어 처리
};

// 판매 데이터 조회 (기본 1주일)
export const fetchSaleData = async (range = 'WEEK') => {
  const res = await API.get(`/data/sale?range=${range}`);
  const result = res.data?.data;
  console.log('판매 데이터:', result);
  return Array.isArray(result) ? result : []; // 방어 처리
};

// 거래 대기 삭제 (구매/판매 공통)
export const deletePendingTrade = async (id, type = 'purchase') => {
  try {
    const endpoint = type === 'purchase' ? `/data/purchase` : `/data/sale`;
    const body = { orderId: id };
    const res = await API.delete(endpoint, { data: body });

    // 여기선 보통 메시지만 확인하거나 성공 여부(resultCode)만 볼 수도 있음
    return res.data;
  } catch (err) {
    console.error('거래 대기 삭제 실패:', err);
    throw err;
  }
};
