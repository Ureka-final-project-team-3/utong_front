// src/components/Loading/SyncLoading.jsx
import React from 'react';
import { SyncLoader } from 'react-spinners';

const SyncLoading = ({ text = '불러오는 중...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <SyncLoader
        color="#386DEE"
        size={20}
        margin={5} // ← 간격 늘리기
      />
      {text && <p className="mt-4 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default SyncLoading;
