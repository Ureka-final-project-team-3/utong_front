import React from 'react';

const StartButton = ({ onClick, disabled }) => {
  return (
    <div className="w-full flex justify-center mt-5">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`
          w-[136px]
          h-[40px]
          ${
            disabled
              ? 'bg-[#949494] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#EB008B] to-[#5B038C]'
          }
          shadow-[0_4px_4px_rgba(0,0,0,0.25)]
          rounded-[16px]
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}

          select-none
        `}
      >
        <span
          className="
            font-inter
            font-extrabold
            text-[20px]
            leading-[24px]
            text-white
            pointer-events-none
            user-select-none
          "
        >
          START
        </span>
      </button>
    </div>
  );
};

export default StartButton;
