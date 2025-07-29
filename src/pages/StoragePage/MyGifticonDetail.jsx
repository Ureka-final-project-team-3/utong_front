import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGifticonDetail } from '@/apis/gifticonsApi';
import BackButton from '@/components/BackButton/BackButton';

const MyGifticonDetail = () => {
  const { gifticonId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGifticonDetail(gifticonId)
      .then((data) => {
        setDetail(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('기프티콘 상세 조회 실패:', err);
        setLoading(false);
      });
  }, [gifticonId]);

  if (loading) {
    return <div className="text-center py-10 text-gray-400">불러오는 중...</div>;
  }

  return (
    <>
      {/* 헤더 */}
      <div className="relative flex items-center justify-between mb-6">
        <BackButton onClick={() => navigate(-1)} />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
          기프티콘 사용
        </h2>
        <div className="w-6" />
      </div>

      {/* 기프티콘 정보 카드 */}
      <div className="bg-white rounded-xl p-5 shadow-md mb-6">
        {/* 이미지 */}
        {detail.imageUrl && (
          <img
            src={detail.imageUrl}
            alt={detail.name}
            className="w-auto h-auto object-contain mx-auto mb-4"
          />
        )}

        {/* 텍스트 정보 */}
        <div className="text-center space-y-1 mb-4">
          <p className="text-base font-semibold">{detail.name}</p>
          <p className="text-sm font-bold text-gray-700">
            {detail.point?.toLocaleString() || detail.price?.toLocaleString()}P
          </p>
        </div>
      </div>

      {/* 유의사항 박스 */}
      <div className="bg-white rounded-xl p-4 text-[10px] text-gray-700 shadow-sm whitespace-pre-line">
        <p className="font-semibold text-xs mb-1">[유의사항]</p>- 문의는 상품권 구매처에 문의해
        주시기 바랍니다.{'\n'}- 본 디지털상품권은 현금과 교환되지 않습니다.{'\n'}- 타 쿠폰
        중복사용이나 포인트 적립 및 제휴카드 할인은 브랜드사 정책에 따릅니다.{'\n'}- 본 상품은
        유효기간 연장이 불가합니다.{'\n'}- 교환품 구매하실 때 현금 영수증이 발행되지 않으며, 본
        쿠폰은 본 게시물 또는 서비스 교환 시 사용처의 매장에서 발행됩니다.
      </div>
    </>
  );
};

export default MyGifticonDetail;
