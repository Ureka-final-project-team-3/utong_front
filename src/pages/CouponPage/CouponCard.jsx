const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0].replace(/-/g, '/');
};

const CouponCard = ({ coupon }) => {
  return (
    <div
      className={`relative flex justify-between items-center p-3 rounded-xl border border-gray-300 bg-white ${
        coupon.statusName === '사용 불가' ? 'opacity-60' : ''
      }`}
    >
      {/* 오른쪽 컬러 바 */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-1.5 ${
          coupon.statusName === '사용 가능' ? 'bg-blue-500' : 'bg-red-500'
        } rounded-r-xl`}
      />

      {/* 왼쪽: 쿠폰 정보 */}
      <div className="flex-1 pr-4">
        <div className="font-medium text-lg text-gray-800 mt-2">
          {coupon.name || coupon.gifticonDescription || coupon.couponId || '이름 없는 쿠폰'}
        </div>

        <div className="text-xs text-gray-400  text-right">
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
  );
};

export default CouponCard;
