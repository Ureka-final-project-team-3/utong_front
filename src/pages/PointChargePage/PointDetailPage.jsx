import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton/BackButton';

const dummyGifticons = [
  {
    id: 1,
    name: '배라 파인트',
    brand: '배스킨라빈스',
    price: 15000,
    image_url: '/public/image/br.png',
    description: '시원한 베라 파인트로 무더위를 날리세요!',
  },
];

const PointDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const gifticon = dummyGifticons.find((item) => item.id === parseInt(id));

  if (!gifticon) {
    return <div className=" text-center text-gray-500">상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <BackButton />
        <h2 className="text-lg font-bold">기프티콘 상세</h2>
        <div className="w-8" /> {/* 빈칸 정렬용 */}
      </div>

      <div className="bg-white rounded-xl shadow p-4 text-center">
        <img
          src={gifticon.image_url}
          alt={gifticon.name}
          className="w-32 h-32 object-contain mx-auto mb-4"
        />
        <div className="text-sm text-gray-500">{gifticon.brand}</div>
        <div className="text-xl font-semibold my-2">{gifticon.name}</div>
        <div className="text-gray-700 text-sm mb-4">{gifticon.description || '상세 설명 없음'}</div>
        <div className="text-blue-600 font-bold text-lg mb-6">
          {gifticon.price.toLocaleString()}P
        </div>
        <button
          onClick={() => {
            alert('교환이 완료되었습니다!');
            navigate('/point-shop');
          }}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          교환하기
        </button>
      </div>
    </div>
  );
};

export default PointDetailPage;
