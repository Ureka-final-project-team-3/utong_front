// components/InfoToastModal.jsx
import React from 'react';

const InfoToastModal = ({ message, type = 'info' }) => {
  if (!message) return null;

  const icon = {
    success: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    info: (
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m0-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
        />
      </svg>
    ),
  };

  const minWidthClass =
    {
      success: 'min-w-[260px]',
      info: 'min-w-[360px]',
    }[type] || 'min-w-[240px]'; // fallback

  return (
    <div className="absolute mt-5 left-1/2 transform -translate-x-1/2 z-40">
      <div
        className={`bg-white border border-gray-300 rounded-full shadow px-4 py-2 w-full ${minWidthClass} flex items-center justify-center gap-2 animate-fade-in-out`}
      >
        {icon[type] || icon.info}
        <span className="text-sm font-medium text-gray-800 text-center">{message}</span>
      </div>
    </div>
  );
};

export default InfoToastModal;
