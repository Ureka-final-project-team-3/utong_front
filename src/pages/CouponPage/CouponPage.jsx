import React, { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import { fetchCoupons } from '@/apis/mypageApi';

// 날짜 포맷 함수: "2025/07/15" 형식으로 변환
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0].replace(/-/g, '/');
};

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons()
      .then((data) => {
        console.log('✅ 쿠폰 응답:', data); // 요청 확인용 콘솔
        setCoupons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ 쿠폰 목록 불러오기 실패:', err);
        setCoupons([]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* 헤더 */}
      <div className="relative flex items-center justify-between">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800">
          쿠폰함
        </h2>
        <div className="w-8" />
      </div>

      {/* 로딩 상태 */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">로딩 중...</div>
      ) : (
        <div className="flex flex-col gap-3 pt-8 pb-8">
          {coupons.length === 0 ? (
            <div className="text-center text-gray-500">보유 중인 쿠폰이 없습니다.</div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.couponId}
                className={`relative flex justify-between items-center p-4 rounded-xl border border-gray-300 bg-white ${
                  coupon.statusName === '사용불가' ? 'opacity-60' : ''
                }`}
              >
                {/* 오른쪽 컬러 바 */}
                <div
                  className={`absolute right-0 top-0 bottom-0 w-1 ${
                    coupon.statusName === '사용 가능' ? 'bg-blue-500' : 'bg-red-500'
                  } rounded-r-xl`}
                />

                {/* 왼쪽: 쿠폰 정보 */}
                <div className="flex-1 pr-4">
                  <div className="font-medium text-lg text-gray-500">
                    {coupon.name || '이름 없는 쿠폰'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {coupon.expiredAt ? `${formatDate(coupon.expiredAt)}까지` : '유효기간 없음'}
                  </div>
                </div>

                {/* 가운데: 점선 */}
                <div className="h-12 w-0.5 border-l-1 border-dashed border-gray-300 mx-2" />

                {/* 오른쪽: 상태 */}
                <div className="w-16 flex justify-center">
                  <div className="text-[10px] font-bold text-gray-800 whitespace-nowrap">
                    {coupon.statusName}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CouponPage;
