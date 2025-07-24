const statusMessages = {
  ALL_COMPLETE: {
    text: '✅ 전체 거래 완료',
    sub: '판매 요청한 데이터가 모두 거래되었습니다.',
  },
  PART_COMPLETE: {
    text: '🟡 일부 거래 완료 (잔여량 있음)',
    sub: '일부 데이터만 거래되었으며, 잔여 데이터의 매칭은 순차적으로 처리됩니다.',
  },
  WAITING: {
    text: '⏳ 매칭 대기 중',
    sub: '판매 요청이 정상적으로 등록되었으며, 매칭은 순차적으로 처리됩니다.',
  },
  BORDERLESS: {
    text: '⚠️ 회선 정보 없음 - 회선 등록이 필요합니다',
    sub: '데이터 거래를 위해 먼저 회선 정보를 등록해 주세요.',
  },
  NEED_DEFAULT_LINE: {
    text: '⚠️ 기본 회선 미지정 - 기본 회선을 설정해 주세요',
    sub: '기본 회선이 지정되지 않아 거래를 진행할 수 없습니다.',
  },
  EXCEED_SALE_LIMIT: {
    text: '❌ 판매 한도 초과',
    sub: '설정된 판매 한도를 초과했습니다.',
  },
  EXIST_BUY_REQUEST: {
    text: '❌ 중복 구매 요청 존재',
    sub: '같은 조건의 구매 요청이 이미 등록되어 있습니다.',
  },
};

const SellSuccessModal = ({ show, statusKey, onClose }) => {
  if (!show) return null;

  const { text, sub, color } = statusMessages[statusKey] || {
    text: '판매예약 등록 완료',
    sub: '판매 요청이 정상적으로 접수되었습니다.',
    color: 'text-gray-800',
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="w-[300px] min-h-[140px] bg-[#F6F6F6] rounded-[10px] flex flex-col items-center justify-center px-4 py-4 text-center space-y-4 relative">
        <p className={`text-[18px] text-[#2C2C2C] font-bold ${color}`}>{text}</p>
        <p className="text-[14px] text-gray-600">{sub}</p>
        <button
          className="mt-8 w-full text-white font-semibold py-2 rounded-[6px] text-sm bg-[#FF4343]"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default SellSuccessModal;
