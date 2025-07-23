import React from 'react';
import OneIcon from '@/assets/icon/one.svg';
import TwoIcon from '@/assets/icon/two.svg';
import ThreeIcon from '@/assets/icon/three.svg';
import FourIcon from '@/assets/icon/four.svg';
import ArrowIcon from '@/assets/icon/arrow.svg';

const iconMap = {
  one: OneIcon,
  two: TwoIcon,
  three: ThreeIcon,
  four: FourIcon,
};

const EventInfoModal = ({ onClose }) => {
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative z-60 w-[300px] bg-white rounded-[20px] p-6 shadow-lg animate-modal-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-bold text-center text-[#2C2C2C] mb-6">이벤트 안내</h2>
        <div className="space-y-5">
          <RuleItem
            type="one"
            text="참여방법"
            sub={`하루 1회 룰렛에 참여하실 수 있습니다.\n[START] 버튼을 눌러주세요.`}
          />
          <RuleItem
            type="two"
            text="보상안내"
            sub={`당첨 시 포인트 또는 쿠폰이 지급됩니다.\n마이페이지 > 쿠폰함에서 확인하실 수 있습니다.`}
          />
          <RuleItem
            type="three"
            text="유의사항"
            sub={`비정상적인 참여 시 당첨이 취소될 수 있습니다.\n이벤트 내용은 사전 고지 없이 변경되거나 종료될 수 있습니다.`}
          />
          <RuleItem
            type="four"
            text="문의하기"
            sub="궁금하신 사항은 고객센터 또는 1:1 문의를 이용해 주세요."
          />
        </div>
        <button
          className="mt-8 w-full text-white font-semibold py-2 rounded-[6px] text-sm bg-[#386DEE]"
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
    <div className="flex gap-3">
      {/* 왼쪽 아이콘 세로 스택 */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-5 h-5">
          <img src={Icon} alt={`${type} icon`} className="w-full h-full" />
        </div>
        <div className="w-3 h-3 mt-1">
          <img src={ArrowIcon} alt="arrow" className="w-full h-full" />
        </div>
      </div>

      {/* 오른쪽 텍스트 */}
      <div className="flex flex-col">
        <p className="text-[12px] text-[#2C2C2C] leading-[15px] font-medium">{text}</p>
        <p className="text-[12px] text-[#777777] leading-[15px] whitespace-pre-line mt-[4px]">
          {sub}
        </p>
      </div>
    </div>
  );
};

export default EventInfoModal;
