import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton/BackButton';
import { fetchGifticonDetail, exchangeGifticon } from '@/apis/shopApi';
import { fetchMyInfo } from '@/apis/mypageApi';

const PointDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gifticon, setGifticon] = useState(null);
  const [userPoint, setUserPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const availableCoupons = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gifticonData, userData] = await Promise.all([
          fetchGifticonDetail(id),
          fetchMyInfo(),
        ]);
        setGifticon(gifticonData);
        setUserPoint(userData.mileage);
      } catch (err) {
        console.error('기프티콘 상세 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray-400">불러오는 중...</div>;
  }

  if (!gifticon || userPoint === null) {
    return <div className="text-center text-gray-500">상품을 찾을 수 없습니다.</div>;
  }

  const remainingPoint = userPoint - gifticon.price;

  return (
    <div className="bg-[#F6F7FC]">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between mb-6">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
          상세페이지
        </h2>
        <div className="w-6" />
      </div>

      {/* 기프티콘 카드 */}
      <div className="bg-white rounded-xl border border-gray-300 px-4 py-6 mb-6 text-center">
        <img
          src={gifticon.imageUrl || '/images/default-gifticon.png'}
          alt={gifticon.name}
          className="w-24 h-auto mx-auto mb-3"
        />
        <div className="text-base font-semibold">{gifticon.name}</div>
        <div className="text-sm font-bold text-gray-700">{gifticon.price.toLocaleString()}P</div>
      </div>

      {/* 구매 정보 */}
      <div className="rounded-xl p-2 text-sm text-gray-800 mb-4">
        <div className="mb-6 flex justify-between items-center">
          <span className="font-semibold">쿠폰</span>
          <span className="text-sm text-gray-500">
            사용가능한 쿠폰 {availableCoupons}개 {'>'}
          </span>
        </div>
        <hr className="my-2 border-gray-200" />
        <div className="flex justify-between py-1">
          <span>잔여 포인트</span>
          <span>{userPoint.toLocaleString()} P</span>
        </div>
        <div className="flex justify-between py-1">
          <span>상품 가격</span>
          <span>{gifticon.price.toLocaleString()} P</span>
        </div>
        <div className="flex justify-between font-semibold text-black pt-2">
          <span>총 잔여 포인트</span>
          <span>{remainingPoint.toLocaleString()} P</span>
        </div>
      </div>

      {/* 버튼 */}

      <button
        onClick={async () => {
          try {
            await exchangeGifticon(id);
            alert('포인트로 교환이 완료되었습니다!');
            navigate('/shop'); // 필요 시 다른 경로로 이동
          } catch (err) {
            console.error('교환 실패:', err);
            alert('교환 중 오류가 발생했습니다.');
          }
        }}
        className="w-full mt-2 py-3 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700"
      >
        포인트로 교환하기
      </button>
    </div>
  );
};

export default PointDetailPage;
