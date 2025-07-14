import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGifticonDetail } from '@/apis/mypageApi';
import BackButton from '@/components/BackButton/BackButton';

const MyGifticonDetail = () => {
  const { gifticonId } = useParams(); // URL 파라미터에서 id 추출
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
    <div className="min-h-screen bg-[#F6F7FC] p ">
      <div className="relative flex items-center justify-between mb-4">
        <BackButton onClick={() => navigate(-1)} />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
          상세 정보
        </h2>
        <div className="w-8" />
      </div>

      {detail.imageUrl && (
        <img
          src={detail.imageUrl}
          alt={detail.name}
          className="w-40 h-auto object-contain mx-auto mb-6"
        />
      )}

      <div className="bg-white rounded-xl p-5 shadow-sm space-y-2 text-sm text-gray-800">
        <p>
          <strong>이름:</strong> {detail.name}
        </p>
        <p>
          <strong>설명:</strong> {detail.description}
        </p>
        <p>
          <strong>가격:</strong> {detail.price.toLocaleString()}원
        </p>
        <p>
          <strong>상태:</strong> {detail.status}
        </p>
        <p>
          <strong>유효기간:</strong> {detail.expiredAt} (D{detail.daysRemaining})
        </p>
      </div>
    </div>
  );
};

export default MyGifticonDetail;
