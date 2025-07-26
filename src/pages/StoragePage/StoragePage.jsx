import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton/BackButton';
import { fetchGifticons } from '@/apis/gifticonsApi';
import SyncLoading from '../../components/Loading/SyncLoading';
import useAuth from '@/hooks/useAuth'; // 커스텀 훅 import

const StoragePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [gifticons, setGifticons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      fetchGifticons()
        .then((data) => {
          setGifticons(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('기프티콘 목록 조회 실패:', err);
          setGifticons([]);
          setLoading(false);
        });
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="h-full flex flex-col">
        {/* 헤더 */}
        <div className="relative flex items-center justify-between px-4 py-4">
          <BackButton />
          <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">보관함</h2>
          <div className="w-8" />
        </div>

        {/* 로딩 */}
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <SyncLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col ">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between py-4">
        <BackButton />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold">보관함</h2>
        <div className="w-8" />
      </div>

      {/* 기프티콘 목록 (스크롤 가능, 스크롤바 숨김) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
        {gifticons.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 pb-6">
            {gifticons.map((item) => {
              const isClickable = item.status === '사용 가능';
              return (
                <div
                  key={item.id}
                  className={`relative rounded-2xl p-2 overflow-hidden bg-white border border-gray-300 ${
                    isClickable ? 'cursor-pointer' : 'pointer-events-none opacity-70'
                  }`}
                  onClick={() => {
                    if (isClickable) navigate(`/gifticons/${item.id}`);
                  }}
                >
                  <div className="flex flex-col items-start relative z-10">
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-3 self-center">
                      <img
                        src={item.imageUrl}
                        alt={item.brand}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="text-xs text-gray-600">{item.brand}</div>
                    <div className="text-xs text-gray-800 leading-tight mb-1 line-clamp-2">
                      {item.name}
                    </div>
                    <div className="text-base font-bold text-gray-800">
                      {item.price.toLocaleString()}P
                    </div>
                    {isClickable && item.daysRemaining !== -1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.expiredAt ? `유효기간: ${item.expiredAt}` : `D-${item.daysRemaining}`}
                      </div>
                    )}
                  </div>

                  {!isClickable && (
                    <>
                      <div className="absolute inset-0 bg-white/70 z-20 rounded-base" />
                      <div className="absolute inset-0 flex items-center justify-center z-30">
                        <span className="text-gray-700 text-base font-bold">{item.status}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">보관 중인 기프티콘이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default StoragePage;
