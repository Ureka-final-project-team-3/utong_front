// 📁 components/modals/FailModal.jsx

import React from 'react';

const BuyFailModal = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[284px] bg-white rounded-[10px] p-6 shadow-lg flex flex-col items-center text-center gap-4">
        <p className="text-[18px] font-bold text-blue-500">구매 실패</p>
        <p className="text-[14px] text-[#555] whitespace-pre-line">{message}</p>
        <button
          className="mt-4 w-full text-white font-semibold py-2 rounded-[6px] text-sm bg-[#386DEE]"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default BuyFailModal;
