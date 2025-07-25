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
  console.log('response data:', res.data); // 전체 응답 콘솔 출력

  return res.data.data;
};

// 판매 데이터 조회 (기본 1주일)
export const fetchSaleData = async (range = 'WEEK') => {
  const res = await API.get(`/data/sale?range=${range}`);
  return res.data.data;
};

// 거래 대기 삭제 (구매/판매 공통)
export const deletePendingTrade = async (id, type = 'purchase') => {
  try {
    const endpoint = type === 'purchase' ? `/data/purchase` : `/data/sale`;
    const body = { orderId: id }; // ✅ 서버가 요구하는 구조
    const res = await API.delete(endpoint, { data: body }); // ✅ 두 번째 인자로 data 전달
    return res.data;
  } catch (err) {
    console.error('거래 대기 삭제 실패:', err);
    throw err;
  }
};
