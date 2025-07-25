import React, { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton/BackButton';
import { fetchCoupons } from '@/apis/mypageApi';
import CouponCard from './CouponCard';
import SyncLoading from '../../components/Loading/SyncLoading';
import CouponModal from './CouponModal';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons()
      .then((data) => {
        console.log('쿠폰 응답:', data);
        setCoupons(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log('쿠폰 목록 불러오기 실패:', err);
        if (err.response?.status === 404) {
          setCoupons([]);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between relative  shrink-0">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800">
          쿠폰함
        </h2>
        <div className="w-8" />
      </div>

      {/* 콘텐츠 (스크롤 가능 영역) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-8">
        {loading ? (
          <div className="text-center text-gray-400 py-50">
            <SyncLoading />
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-8">
            {coupons.length === 0 ? (
              <div className="text-center text-gray-500">보유 중인 쿠폰이 없습니다.</div>
            ) : (
              coupons.map((coupon, index) => (
                <div
                  key={`${coupon.couponId}-${index}`}
                  onClick={() => {
                    if (coupon.statusName === '사용 가능') {
                      setSelectedCoupon(coupon);
                    }
                  }}
                >
                  <CouponCard coupon={coupon} />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 모달 */}
      {selectedCoupon && (
        <CouponModal coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} />
      )}
    </div>
  );
};

export default CouponPage;
