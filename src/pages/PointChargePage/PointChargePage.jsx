import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton/BackButton';
import { fetchAllGifticons } from '@/apis/shopApi';
import { fetchMyInfo } from '@/apis/mypageApi';
import useAuth from '@/hooks/useAuth';
import coinIcon from '@/assets/icon/coin.png';
import { motion } from 'framer-motion';

const PointChargePage = () => {
  const { user: authUser, isLoading: authLoading } = useAuth();

  const [user, setUser] = useState(null);
  const [gifticons, setGifticons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate();

  const categories = [
    { value: '', label: '전체' },
    { value: '001', label: '푸드' },
    { value: '002', label: '영화' },
    { value: '003', label: '카페' },
    { value: '004', label: '쇼핑' },
  ];

  const fetchGifticons = useCallback(async (category = '', page = 1, size = 10) => {
    try {
      setLoading(true);
      setError(null);

      const allGifticons = await fetchAllGifticons();
      const filtered = category
        ? allGifticons.filter((g) => g.category === category)
        : allGifticons;

      const paginated = filtered.slice((page - 1) * size, page * size);
      setGifticons(paginated);
      setTotalPages(Math.ceil(filtered.length / size));
    } catch (err) {
      console.error(err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchGifticons(selectedCategory, currentPage);
    }
  }, [fetchGifticons, selectedCategory, currentPage, authLoading, authUser]);

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchMyInfo()
        .then((data) => setUser(data))
        .catch((err) => console.error('유저 정보 가져오기 실패:', err));
    }
  }, [authLoading, authUser]);

  const handleViewDetails = (gifticonId) => {
    navigate(`/point-shop/${gifticonId}`);
  };

  if (authLoading) {
    return (
      <div>
        <div className="relative flex items-center justify-between mb-6">
          <BackButton />
          <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
            포인트 상점
          </h2>
          <span className="flex items-center gap-1 text-base text-blue-600 font-bold">
            <img src={coinIcon} alt="코인 아이콘" className="w-4 h-4" />
            ...P
          </span>
        </div>
        <div className="text-center text-gray-700 font-semibold text-lg mt-20">
          로딩 중입니다...
        </div>
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div>
      <motion.div
        className="relative flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">
          포인트 상점
        </h2>
        <span className="flex items-center gap-1 text-base text-blue-600 font-bold">
          <img src={coinIcon} alt="코인 아이콘" className="w-4 h-4" />
          {user?.mileage?.toLocaleString() ?? '...'}P
        </span>
      </motion.div>

      <div className="flex gap-6 mb-6 overflow-x-auto">
        {categories.map((cat, idx) => (
          <motion.button
            key={cat.value}
            onClick={() => {
              setSelectedCategory(cat.value);
              setCurrentPage(1);
            }}
            className={`text-base whitespace-nowrap px-1 py-2 border-b-2 transition-colors ${
              selectedCategory === cat.value
                ? 'border-blue-500 text-blue-600 font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-4 mb-6 animate-pulse">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-2 shadow-sm">
              <div className="flex flex-col items-start">
                <div className="w-full h-20 rounded-xl bg-gray-100 mb-3" />
                <div className="h-3 w-1/2 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-3/4 bg-gray-100 rounded mb-2" />
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-4">
          {error}
          <button onClick={() => fetchGifticons()} className="block text-sm underline mt-2">
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {gifticons.map((item, idx) => (
              <motion.div
                key={item.id}
                onClick={() => handleViewDetails(item.id)}
                className="bg-white rounded-2xl p-2 shadow-sm cursor-pointer hover:shadow-md transition"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="flex flex-col items-start">
                  <div className="w-full h-20 rounded-xl flex items-center justify-center mb-3">
                    <img
                      src={item.imageUrl || '/images/default-gifticon.png'}
                      alt={item.brand}
                      className="w-24 h-24 object-contain"
                    />
                  </div>

                  <div className="text-base font-medium text-gray-800 text-left leading-tight mb-2 mt-2">
                    {item.name}
                  </div>
                  <div className="text-base font-bold text-gray-800 text-left">
                    {item.price.toLocaleString()}P
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <motion.div
              className="flex justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="text-sm px-4 py-2 border rounded disabled:opacity-40"
              >
                이전
              </button>
              <span className="text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="text-sm px-4 py-2 border rounded disabled:opacity-40"
              >
                다음
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default PointChargePage;
