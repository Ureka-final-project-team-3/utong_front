import React, { useState } from 'react';
import BuyDataHeader from './components/BuyDataHeader';
import Button from '../../../components/common/Button';

const BuyDataPage = () => {
  const userName = '동석';
  const point = 3000;
  const data = 10;
  const avgPrice = 8600;
  const minPrice = 8400;

  const dataOptions = ['1GB', '5GB', '10GB', '20GB'];
  const [selectedData, setSelectedData] = useState(dataOptions[0]);

  return (
    <div>
      {/* 헤더 */}
      <BuyDataHeader />

      {/* 유저 정보 */}
      <div className="mt-6 text-[20px] font-bold text-[#2C2C2C]">{userName}님</div>
      <div className="text-[#565656] text-[12px] text-right">(1GB)</div>

      {/* 보유 포인트 / 보유 데이터 / 평균가 / 최저가 */}
      <div className="flex items-center justify-between gap-2">
        {/* 왼쪽 */}
        <div className="flex-1 space-y-2 text-[13px] text-[#5D5D5D]">
          <div className="flex justify-between">
            <span>보유 포인트</span>
            <span className="text-[#2C2C2C]">
              {point} <span className="text-[#565656]">P</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span>보유 데이터</span>
            <span className="text-[#2C2C2C]">
              {data} <span className="text-[#565656]">GB</span>
            </span>
          </div>
        </div>

        {/* 중앙 선 */}
        <div className="w-px h-[35px] bg-[#D9D9D9]" />

        {/* 오른쪽 */}
        <div className="flex-1 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-[#4B4B4B] text-[14px]">평균가</span>
            <span className="text-[#2C2C2C] text-[15px] font-medium">
              {avgPrice.toLocaleString()}{' '}
              <span className="text-[#565656] text-[13px] font-bold">원</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D5D5D]">최저가</span>
            <span className="text-[#2C2C2C] text-[15px]">
              {minPrice.toLocaleString()} <span className="text-[#565656] text-[13px]">원</span>
            </span>
          </div>
        </div>
      </div>

      {/* 구매 가격 박스 */}
      <div className="mt-6 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2">구매할 가격</div>
        <div className="flex justify-end items-center">
          <span className="text-[20px] font-medium text-[#2C2C2C]">{avgPrice}</span>
          <span className="ml-1 text-[20px] text-[#2C2C2C]">P</span>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-4 text-[10px] text-[#386DEE] text-left">
        최저가보다 낮은 금액은 구매대기됩니다.
      </div>

      {/* 데이터 선택 박스 */}
      <div className="mt-4 border border-[#B1B1B1] rounded-[8px] bg-white p-4">
        <div className="text-[15px] text-[#2C2C2C] mb-2">데이터</div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[13px] text-[#B1B1B1]">얼마나 구매할까요?</span>
          <span className="text-[20px] text-[#2C2C2C]">{selectedData.replace('GB', '')} GB</span>
        </div>
        <div className="flex gap-2 mt-2">
          {dataOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedData(option)}
              className={`w-[60px] h-[25px] rounded-[10px] border text-[12px] font-medium flex items-center justify-center ${
                selectedData === option
                  ? 'border-[#386DEE] bg-[#E6EEFF] text-[#386DEE]'
                  : 'border-[#B1B1B1] bg-[#F6F7FB] text-[#777]'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {/* 안내 문구 */}
      <div className="mt-4 text-[10px] text-[#386DEE] text-left">
        최저가의 모든 데이터 양보다 수량이 작으면 구매대기됩니다.
      </div>

      {/* 거래 요약 */}
      <div className="mt-6 border-t border-gray-300 pt-4 space-y-2">
        <div className="flex justify-between text-[16px] text-[#5D5D5D]">
          <span>총 결제 포인트</span>
          <span className="text-[20px] text-[#2C2C2C] font-medium">{avgPrice} P</span>
        </div>
      </div>

      {/* 구매 버튼 */}
      <div className="mt-auto pt-6">
        <Button
          onClick={() => alert('구매 요청!')}
          className="bg-[#386DEE] hover:bg-[#2f5bd9] w-full"
        >
          구매하기
        </Button>
      </div>
    </div>
  );
};

export default BuyDataPage;
