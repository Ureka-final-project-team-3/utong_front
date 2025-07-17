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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
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

  if (loading) return <div className="text-center py-10 text-gray-400">불러오는 중...</div>;
  if (!gifticon || userPoint === null)
    return <div className="text-center text-gray-500">상품을 찾을 수 없습니다.</div>;

  const remainingPoint = userPoint - gifticon.price;

  const handleExchange = async () => {
    try {
      await exchangeGifticon(id);
      setIsSuccessModalOpen(true); // alert → 모달
    } catch (err) {
      console.error('교환 실패:', err);
      alert('교환 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
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
        <hr className="my-4 border-gray-200" />
        <div className="flex justify-between py-1 text-gray-600">
          <span>잔여 포인트</span>
          <span>{userPoint.toLocaleString()} P</span>
        </div>
        <div className="flex justify-between py-1 text-gray-600">
          <span>상품 가격</span>
          <span>{gifticon.price.toLocaleString()} P</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-600 pt-4">
          <span>총 잔여 포인트</span>
          <span>{remainingPoint.toLocaleString()} P</span>
        </div>
      </div>

      {/* 교환 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-2 py-3 bg-[#386DEE] text-white text-base font-semibold rounded-xl hover:bg-blue-700"
      >
        포인트로 교환하기
      </button>

      {/* 확인 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow-md text-center animate-fadeIn">
            <p className="text-sm text-gray-800 mb-6">
              해당 상품은 <span className="font-semibold">환불이 불가능합니다.</span>
              <br />
              구매를 진행하시겠습니까?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-600 text-sm"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  handleExchange();
                }}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 모달 */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white w-72 p-6 rounded-xl shadow-md text-center animate-fadeIn">
            <p className="text-sm text-gray-800 mb-4">교환이 완료되었습니다!</p>
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate('/shop');
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointDetailPage;
