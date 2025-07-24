import React from 'react';

const FailRewardModal = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white rounded-[20px] p-6 text-center">
        <h2 className="text-xl font-bold text-[#FF3B30]">꽝!! 아쉬워요!</h2>
        <p className="mt-2 text-gray-600">다음 기회에 꼭 당첨되시길 바랍니다</p>
        <button
          className="mt-6 w-full py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default FailRewardModal;
