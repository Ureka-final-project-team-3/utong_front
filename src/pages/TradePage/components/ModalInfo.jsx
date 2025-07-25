// ModalInfo.jsx
import React from 'react';
import OneIcon from '@/assets/icon/one.svg';
import OneIconRed from '@/assets/icon/one-red.svg';
import TwoIcon from '@/assets/icon/two.svg';
import TwoIconRed from '@/assets/icon/two-red.svg';
import ThreeIcon from '@/assets/icon/three.svg';
import ThreeIconRed from '@/assets/icon/three-red.svg';
import FourIcon from '@/assets/icon/four.svg';
import FourIconRed from '@/assets/icon/four-red.svg';
import FiveIcon from '@/assets/icon/five.svg';
import FiveIconRed from '@/assets/icon/five-red.svg';
import SixIcon from '@/assets/icon/six.svg';
import SixIconRed from '@/assets/icon/six-red.svg';
import SevenIcon from '@/assets/icon/seven.svg';
import SevenIconRed from '@/assets/icon/seven-red.svg';

import ArrowIcon from '@/assets/icon/arrow.svg';

const iconMap = {
  one: { blue: OneIcon, red: OneIconRed },
  two: { blue: TwoIcon, red: TwoIconRed },
  three: { blue: ThreeIcon, red: ThreeIconRed },
  four: { blue: FourIcon, red: FourIconRed },
  five: { blue: FiveIcon, red: FiveIconRed },
  six: { blue: SixIcon, red: SixIconRed },
  seven: { blue: SevenIcon, red: SevenIconRed },
};

const ModalInfo = ({ onClose, color = 'blue' }) => {
  const buttonColor = color === 'red' ? 'var(--red)' : 'var(--blue)';

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
            color={color}
            text="가격은 최소 5,000원부터 시작되고, 최고 12,000원까지만 가능해요."
            sub="그보다 싸거나 비싸면 거래가 안 돼요."
          />
          <RuleItem
            type="two"
            color={color}
            text="사용자 요금제가 제공하는 데이터의 10%만 판매 가능해요."
            sub="정책상 일부만 판매할 수 있도록 제한되어 있어요."
          />
          <RuleItem
            type="three"
            color={color}
            text="매물 상황에 따라 자동으로 최적의 거래가 이루어져요."
sub="판매 시: 등록된 구매 매물 중 가장 높은 가격에 판매돼요.
구매 시: 등록된 판매 매물 중 가장 낮은 가격에 구매돼요."

          />
          <RuleItem
            type="four"
            color={color}
            text="내가 산 데이터는 다시 팔 수 없어요."
            sub="한 번 산 건 끝! 다시 팔기 금지예요."
          />
          <RuleItem
            type="five"
            color={color}
            text="거래는 최소 1GB 단위로만 가능해요."
            sub="0.5GB 같은 건 안 되고, 무조건 1GB 단위예요."
          />
          <RuleItem
            type="six"
            color={color}
            text="가격은 100원 단위로만 바꿀 수 있어요."
            sub="5,100원은 OK! 5,125원은 안 돼요."
          />
          <RuleItem
            type="seven"
            color={color}
            text="사용 중인 요금제와 같은 종류만 거래할 수 있어요."
            sub="5G 요금제는 5G끼리, LTE 요금제는 LTE끼리만 사고팔 수 있어요."
          />
        </div>
        <button
          className="mt-8 w-full text-white font-semibold py-2 rounded-[6px] text-sm"
          style={{ backgroundColor: buttonColor }}
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

const RuleItem = ({ type, text, sub, color }) => {
  const Icon = iconMap[type][color];

  return (
    <div className="flex gap-3">
      {/* 숫자 아이콘만 왼쪽 상단에 고정 */}
      <div className="w-5 h-5 shrink-0 mt-[2px]">
        <img src={Icon} alt={`${type} icon`} className="w-full h-full" />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col">
        <p className="text-[12px] text-[#2C2C2C] leading-[15px] font-medium">{text}</p>

        <p className="text-[12px] text-[#777777] leading-[15px] mt-1 whitespace-pre-line flex items-start gap-1">
          <img src={ArrowIcon} alt="arrow" className="w-3 h-3 mt-[2px] flex-shrink-0" />
          <span>{sub}</span>
        </p>
      </div>
    </div>
  );
};

export default ModalInfo;
