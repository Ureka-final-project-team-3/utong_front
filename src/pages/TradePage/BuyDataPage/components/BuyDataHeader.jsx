import React from 'react';
import BackButton from '../../../../components/BackButton/BackButton';
import help from '@/assets/icon/help.svg';
const BuyDataHeader = () => {
  return (
    <div className="w-full   flex items-center justify-between">
      <BackButton />

      <h1 className="text-[length:var(--text-lg)] text-[color:var(--blue)] font-bold">구매하기</h1>

      <img src={help} alt="도움말" draggable={false} />
    </div>
  );
};

export default BuyDataHeader;
