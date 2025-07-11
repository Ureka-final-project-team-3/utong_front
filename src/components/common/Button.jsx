import React from 'react';

const Button = ({ children, onClick, disabled, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[300px] h-[50px] bg-[#2769F6] text-white text-[20px] font-normal rounded-md
        flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
