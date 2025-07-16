import React, { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import { fetchCoupons } from '@/apis/mypageApi';
import CouponCard from './CouponCard'; // 경로는 실제 구조에 맞게 수정하세요

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons()
      .then((data) => {
        console.log('✅ 쿠폰 응답:', data);
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
            coupons.map((coupon) => <CouponCard key={coupon.couponId} coupon={coupon} />)
          )}
        </div>
      )}
    </div>
  );
};

export default CouponPage;
