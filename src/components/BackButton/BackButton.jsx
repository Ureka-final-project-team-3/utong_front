// src/components/common/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '@/assets/icon/back.svg';

const BackButton = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`absolute top-[55px] left-[30px] z-10 ${className}`}
      aria-label="뒤로가기"
    >
      <img src={backIcon} alt="뒤로가기" className="w-[20px] h-[14px]" draggable={false} />
    </button>
  );
};

export default BackButton;
