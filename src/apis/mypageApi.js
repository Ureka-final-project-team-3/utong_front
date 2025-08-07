import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/user',
  withCredentials: true,
});

// 요청 인터셉터
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 내 정보
export const fetchMyInfo = async () => {
  const res = await API.get('/info');
  return res?.data?.data ?? null;
};

// 포인트 조회
export const fetchPoint = async () => {
  const res = await API.get('/points');
  return res?.data?.data ?? 0;
};

// 포인트 충전
export const chargePoint = async ({ chargedAmount, userCouponId }) => {
  const payload = { chargedAmount };
  if (userCouponId) payload.userCouponId = userCouponId;

  const res = await API.post('/points/charge', payload);
  return res?.data?.data ?? null;
};

export const fetchCoupons = async () => {
  try {
    const res = await API.get('/coupons');
    const raw = res?.data?.data ?? res?.data ?? [];

    if (Array.isArray(raw)) return raw;

    if (raw && typeof raw === 'object') {
      // 서버가 { coupons: [...] } 형태로 줄 수 있음
      if (Array.isArray(raw.coupons)) return raw.coupons;

      // 객체를 값 배열로 변환 (예: {a:{}, b:{}} → [{}, {}])
      return Object.values(raw);
    }

    return [];
  } catch (e) {
    console.error('fetchCoupons error:', e);
    return []; // 실패해도 컴포넌트 안전 렌더
  }
};

export const fetchCouponUse = async (userCouponId) => {
  const res = await API.post('/coupons', { userCouponId });
  return res?.data?.data ?? null;
};
