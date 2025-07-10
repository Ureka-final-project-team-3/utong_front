import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton/BackButton';

const PointChargePage = () => {
  const [userPoint, setUserPoint] = useState(3000); // 사진과 맞춤
  const [gifticons, setGifticons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  // 카테고리 목록
  const categories = [
    { value: '', label: '전체' },
    { value: 'food', label: '푸드' },
    { value: 'movie', label: '영화' },
    { value: 'cafe', label: '카페' },
    { value: 'shopping', label: '쇼핑' },
  ];

  // 더미 데이터 (사진에 맞게 수정)
  const getDummyGifticons = () => {
    const allGifticons = [
      // 푸드 카테고리
      {
        id: 1,
        name: '배라 파인트',
        brand: '배스킨라빈스',
        price: 15000,
        image_url: '/images/br.png',
        category: 'food',
      },
      {
        id: 2,
        name: '영화 5000원 관람권',
        brand: 'CGV',
        price: 15000,
        image_url: '/images/cgv.png',
        category: 'movie',
      },
      {
        id: 3,
        name: '카페라떼',
        brand: '메가커피',
        price: 4000,
        image_url: '/images/mega.png',
        category: 'cafe',
      },
      {
        id: 4,
        name: '영화 5000원 관람권',
        brand: '메가박스',
        price: 100,
        image_url: '/images/megabox.png',
        category: 'movie',
      },
      // 추가 더미 데이터
      {
        id: 5,
        name: '스타벅스 아메리카노',
        brand: '스타벅스',
        price: 4500,
        image_url: '/images/starbucks.png',
        category: 'cafe',
      },
      {
        id: 6,
        name: '맥도날드 빅맥세트',
        brand: '맥도날드',
        price: 7000,
        image_url: '/images/mcdonalds.png',
        category: 'food',
      },
      {
        id: 7,
        name: 'KFC 치킨버거 세트',
        brand: 'KFC',
        price: 8500,
        image_url: '/images/kfc.png',
        category: 'food',
      },
      {
        id: 8,
        name: '롯데시네마 관람권',
        brand: '롯데시네마',
        price: 14000,
        image_url: '/images/lotte-cinema.png',
        category: 'movie',
      },
      {
        id: 9,
        name: '투썸플레이스 아메리카노',
        brand: '투썸플레이스',
        price: 4000,
        image_url: '/images/twosome.png',
        category: 'cafe',
      },
      {
        id: 10,
        name: '이디야 아메리카노',
        brand: '이디야',
        price: 2500,
        image_url: '/images/ediya.png',
        category: 'cafe',
      },
      {
        id: 11,
        name: '쿠팡 상품권',
        brand: '쿠팡',
        price: 10000,
        image_url: '/images/coupang.png',
        category: 'shopping',
      },
      {
        id: 12,
        name: '11번가 상품권',
        brand: '11번가',
        price: 10000,
        image_url: '/images/11st.png',
        category: 'shopping',
      },
    ];

    return allGifticons;
  };

  // 기프티콘 목록 가져오기 (더미 데이터)
  const fetchGifticons = async (category = '', page = 1, size = 10) => {
    try {
      setLoading(true);
      setError(null);

      // 더미 데이터 로딩 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 500));

      const allGifticons = getDummyGifticons();

      // 카테고리 필터링
      const filteredGifticons = category
        ? allGifticons.filter((item) => item.category === category)
        : allGifticons;

      // 페이지네이션 처리
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedGifticons = filteredGifticons.slice(startIndex, endIndex);

      setGifticons(paginatedGifticons);
      setTotalPages(Math.ceil(filteredGifticons.length / size));
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('기프티콘 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchGifticons(selectedCategory, currentPage);
  }, [selectedCategory, currentPage]);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 페이지를 1로 초기화
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 상세보기 페이지로 이동 핸들러
  const handleViewDetails = (gifticonId) => {
    // 상세보기 페이지로 이동하는 로직 구현
    // 예: navigate(`/point-shop/${gifticonId}`) 또는 라우터 사용
    console.log('상세보기 페이지로 이동:', gifticonId);

    // 임시로 알림으로 대체 (실제 구현시 라우터 사용)
    const selectedGifticon = gifticons.find((g) => g.id === gifticonId);
    if (selectedGifticon) {
      alert(`${selectedGifticon.name} 상세보기 페이지로 이동합니다.`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}

      <div className="relative flex items-center justify-between mb-6">
        <BackButton />

        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
          포인트 상점
        </h2>

        <span className="text-lg text-blue-600 font-bold">{userPoint.toLocaleString()}P</span>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-6 mb-6 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryChange(category.value)}
            className={`text-base whitespace-nowrap px-1 py-2 border-b-2 transition-colors ${
              selectedCategory === category.value
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="text-red-600 text-sm">{error}</div>
          <button
            onClick={() => fetchGifticons(selectedCategory, currentPage)}
            className="mt-2 text-sm text-red-600 underline"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 기프티콘 목록 */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {gifticons.map((gifticon) => (
              <div
                key={gifticon.id}
                className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(gifticon.id)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <img
                      src={gifticon.image_url || '/images/default-gifticon.png'}
                      alt={gifticon.brand}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{gifticon.brand}</div>
                  <div className="text-sm font-medium text-gray-800 text-center leading-tight mb-4">
                    {gifticon.name}
                  </div>
                  <div className="text-xl font-bold text-gray-800 text-center">
                    {gifticon.price?.toLocaleString()}P
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 빈 목록 처리 */}
          {gifticons.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">상품이 없습니다.</div>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm bg-white border border-gray-300 disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-4 py-2 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-sm bg-white border border-gray-300 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PointChargePage;
