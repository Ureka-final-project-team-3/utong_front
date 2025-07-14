import React, { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton/BackButton';

const StoragePage = () => {
  const [gifticons, setGifticons] = useState([]);
  const [loading, setLoading] = useState(true);

  // 목데이터
  const mockGifticons = [
    {
      id: 1,
      name: '배라 파인트',
      brand: '배스킨라빈스',
      price: 15000,
      image_url: '/images/br.png',
      status: '사용 가능',
    },
    {
      id: 2,
      name: 'CGV 영화 관람권',
      brand: 'CGV',
      price: 15000,
      image_url: '/images/cgv.png',
      status: '사용 완료',
    },
    {
      id: 3,
      name: '메가커피 라떼',
      brand: '메가커피',
      price: 4000,
      image_url: '/images/mega.png',
      status: '유효기간 만료',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setGifticons(mockGifticons);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between px-4 py-3">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">보관함</h2>
        <div className="w-8" /> {/* 오른쪽 여백 */}
      </div>

      {/* 로딩 */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">불러오는 중...</div>
      ) : gifticons.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 px-4 pb-8">
          {gifticons.map((item) => (
            <div
              key={item.id}
              className="relative bg-white rounded-2xl p-3 shadow-sm overflow-hidden"
            >
              {/* 콘텐츠 */}
              <div className="flex flex-col items-start relative z-10">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-3">
                  <img src={item.image_url} alt={item.brand} className="w-16 h-16 object-contain" />
                </div>
                <div className="text-xs text-gray-600">{item.brand}</div>
                <div className="text-xs font-medium text-gray-800 leading-tight mb-2 line-clamp-2">
                  {item.name}
                </div>
                <div className="text-base font-bold text-gray-800">
                  {item.price.toLocaleString()}P
                </div>
              </div>

              {/* 상태 오버레이 */}
              {item.status !== '사용 가능' && (
                <>
                  <div className="absolute inset-0 bg-white/70 z-20 rounded-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <span className="text-gray-700 text-sm font-bold">{item.status}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">보관 중인 기프티콘이 없습니다.</div>
      )}
    </div>
  );
};

export default StoragePage;
