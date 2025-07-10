import { useState } from 'react';
import Transcation from '@/assets/icon/Transcation.svg';
import Couponbox from '@/assets/icon/Couponbox.svg';
import storagebox from '@/assets/icon/storagebox.svg';
import Editinformation from '@/assets/icon/Editinformation.svg';
import Notificationbox from '@/assets/icon/Notificationbox.svg';
import ServiceGuide from '@/assets/icon/ServiceGuide.svg';
import Notificationsettings from '@/assets/icon/Notificationsettings.svg';
import dataIcon from '@/assets/image/data.svg';
import pointIcon from '@/assets/image/point.svg';
import utong from '@/assets/image/MyPageutong.svg';

export default function MyPage() {
  const [user] = useState({
    name: '유동석',
    email: 'example@example.com',
    mileage: 10000,
    phoneNumber: '010-1234-5678',
    remainingData: 50,
  });

  return (
    <div className="max-h-[auto] overflow-hidden text-black">
      {/* Header */}
      <div className="flex items-center gap-4 pt-15">
        <img src={utong} alt="데이터 아이콘" className="w-[100px] h-auto" />
        <h1 className="text-white text-2xl font-bold">{user.name}</h1>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-600 text-white rounded-xl p-3">
        <div className="flex justify-between items-start mb-2">
          {/* 판매 가능 데이터 */}
          <div className="w-full block items-center gap-1 pr-1">
            <div className="flex items-center gap-1">
              <img src={dataIcon} alt="데이터 아이콘" className="w-5 h-5" />
              <div className="text-base">판매 가능 데이터</div>
            </div>
            <div className="text-base  text-right">{user.remainingData}GB</div>
          </div>

          {/* 포인트 */}
          <div className="w-full block items-center gap-2 pl-2">
            <div className="flex text-left gap-1 w-full">
              <img src={pointIcon} alt="포인트 아이콘" className="w-5 h-5" />
              <div className="text-base">포인트</div>
            </div>
            <div className="text-base  text-right">{user.mileage.toLocaleString()}P</div>
          </div>
        </div>

        <div className="flex justify-between gap-2 mb-3">
          <button className="flex-1 bg-[#1355E0] text-base   text-white py-1 rounded-md ">
            거래하기
          </button>
          <button className="flex-1 bg-[#1355E0] text-base text-white py-1 rounded-md ">
            충전하기
          </button>
        </div>

        <div className="flex w-full">
          <img src={dataIcon} alt="데이터 아이콘" className="w-5 h-5" />
          <div className="w-full  text-base pl-1">전체 데이터</div>
          <div className=" w-full text-base text-right">100 GB</div>
        </div>
      </div>

      {/* 메뉴 버튼들 - 4개 + 3개 분리 */}
      <div className=" grid grid-cols-4 gap-y-6 mt-10 text-center  font-Medium text-xs text-[#5F5F5F]">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#1355E0] flex items-center justify-center mb-1">
            <img src={Transcation} alt="거래 내역" className="w-[20px] h-[22px]" />
          </div>
          거래 내역
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#1355E0] flex items-center justify-center mb-1">
            <img src={Couponbox} alt="쿠폰함" className="w-[22px] h-[22px]" />
          </div>
          쿠폰함
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#1355E0] flex items-center justify-center mb-1">
            <img src={storagebox} alt="보관함" className="w-[22px] h-[22px]" />
          </div>
          보관함
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#1355E0] flex items-center justify-center mb-1">
            <img src={Editinformation} alt="정보 수정" className="w-[22px] h-[22px]" />
          </div>
          정보 수정
        </div>
      </div>

      <div className="grid grid-cols-3 gap-y-6 mt-8 px-5 text-center font-Medium text-xs text-[#5F5F5F] ">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#1355E0] flex items-center justify-center mb-1">
            <img src={Notificationbox} alt="알림함" className="w-[22px] h-[22px]" />
          </div>
          알림함
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#1355E0] flex items-center justify-center mb-1">
            <img src={ServiceGuide} alt="서비스 가이드" className="w-[22px] h-[22px]" />
          </div>
          서비스 가이드
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#1355E0] flex items-center justify-center mb-1">
            <img src={Notificationsettings} alt="알림 설정" className="w-[22px] h-[22px]" />
          </div>
          알림 설정
        </div>
      </div>

      {/* 로그아웃 */}
      <div className="mt-20 text-center">
        <button className="text-blue-600 ">로그아웃</button>
      </div>
    </div>
  );
}
