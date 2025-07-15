import React from 'react';
import BackButton from '@/components/BackButton/BackButton'; // 경로 확인

const coupons = [
  {
    id: 1,
    name: '수수료 면제 쿠폰',
    expiry: '2025/07/13까지',
    status: '사용가능',
  },
  {
    id: 2,
    name: '포인트 할인 쿠폰',
    expiry: '2025/07/13까지',
    status: '사용가능',
  },
  {
    id: 3,
    name: '수수료 면제 쿠폰',
    expiry: '2025/06/30까지',
    status: '사용불가',
  },
];

const CouponPage = () => {
  return (
    <div>
      {/* 헤더 */}
      <div className="relative flex items-center justify-between ">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800">
          쿠폰함
        </h2>
        <div className="w-8" />
      </div>

      {/* 쿠폰 목록 */}
      <div className="flex flex-col gap-3 pt-8  pb-8">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`relative flex justify-between items-center p-4 rounded-xl border-1 border-gray-300 bg-white ${
              coupon.status === '사용불가' ? 'opacity-60' : ''
            }`}
          >
            {/* 오른쪽 끝 세로 컬러 바 */}
            <div
              className={`absolute right-0 top-0 bottom-0 w-1 ${
                coupon.status === '사용가능' ? 'bg-blue-500' : 'bg-red-500'
              } rounded-r-xl`}
            />
            <div>
              <div className="font-medium text-lg text-gray-500">{coupon.name}</div>
              <div className="text-xs text-gray-400 mt-1">{coupon.expiry}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-0.5 h-12 border-l-2 border-dashed border-gray-300" />
              <div
                className={`text-sm font-bold ${
                  coupon.status === '사용가능' ? 'text-gray-800' : 'text-gray-800'
                }`}
              >
                {coupon.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponPage;
