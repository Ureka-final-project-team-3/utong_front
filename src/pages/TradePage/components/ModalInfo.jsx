import React from 'react';
import OneIcon from '@/assets/icon/one.svg';
import TwoIcon from '@/assets/icon/two.svg';
import ThreeIcon from '@/assets/icon/three.svg';
import FourIcon from '@/assets/icon/four.svg';
import FiveIcon from '@/assets/icon/five.svg';
import SixIcon from '@/assets/icon/six.svg';
import ArrowIcon from '@/assets/icon/arrow.svg';

const iconMap = {
  one: OneIcon,
  two: TwoIcon,
  three: ThreeIcon,
  four: FourIcon,
  five: FiveIcon,
  six: SixIcon,
};

const ModalInfo = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]"
      onClick={onClose}
    >
      <div
        className="relative z-60 w-[300px] bg-white rounded-[20px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-bold text-center text-[#2C2C2C] mb-6">거래 규칙</h2>
        <div className="space-y-5">
          <RuleItem
            type="one"
            text="가격은 최소 5,000원부터 시작되고, 최고 12,000원까지만 가능해요."
            sub="그보다 싸거나 비싸면 거래가 안 돼요."
          />
          <RuleItem
            type="two"
            text="현재 평균 가격에서 ±30% 범위 안에서만 거래할 수 있어요."
            sub="너무 싸게 또는 너무 비싸게는 못 팔아요."
          />
          <RuleItem
            type="three"
            text="구매 입찰가의 최대가격 이상으로만 거래 할 수 있어요."
            sub="최대가격은 메인페이지에서 알려드릴게요."
          />
          <RuleItem
            type="four"
            text="내가 산 데이터는 다시 팔 수 없어요."
            sub="한 번 산 건 끝! 다시 팔기 금지예요."
          />
          <RuleItem
            type="five"
            text="거래는 최소 1GB 단위로만 가능해요."
            sub="0.5GB 같은 건 안 되고, 무조건 1GB 단위예요."
          />
          <RuleItem
            type="six"
            text="가격은 100원 단위로만 바꿀 수 있어요."
            sub="5,130원은 OK! 5,125원은 안 돼요."
          />
        </div>
        <button
          className="mt-8 w-full bg-[#386DEE] text-white font-semibold py-2 rounded-[6px] text-sm"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

const RuleItem = ({ type, text, sub }) => {
  const Icon = iconMap[type];

  return (
    <div className="flex items-start gap-2">
      <div className="w-5 h-5 shrink-0 mt-[2px]">
        <img src={Icon} alt={`${type} icon`} className="w-full h-full" />
      </div>

      <div className="flex flex-col">
        <p className="text-[12px] text-[#2C2C2C] leading-[15px]">{text}</p>
        <div className="flex items-center gap-1 mt-[4px]">
          <img src={ArrowIcon} alt="arrow" className="w-3 h-3" />
          <p className="text-[10px] text-[#777777] leading-[12px]">{sub}</p>
        </div>
      </div>
    </div>
  );
};

export default ModalInfo;
