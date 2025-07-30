import React, { useState } from 'react';
import BackButton from '../../../../components/BackButton/BackButton';
import help from '@/assets/icon/help.svg';
import useTradeStore from '@/stores/tradeStore';
import { useNavigate } from 'react-router-dom';

const SellDataHeader = () => {
  const selectedNetwork = useTradeStore((state) => state.selectedNetwork);
  const networkLabel = selectedNetwork === 'LTE' ? 'LTE' : '5G';
  const navigate = useNavigate();
  const goTotradeguide2 = () => {
    navigate(`/tradeguide2`);
  };

  return (
    <div className="w-full   flex items-center justify-between">
      <BackButton />

      <h1 className="text-[length:var(--text-lg)] text-[color:var(--red)] font-bold">
        {networkLabel} 판매하기
      </h1>

      <img
        src={help}
        alt="도움말"
        draggable={false}
        className="cursor-pointer"
        onClick={goTotradeguide2}
      />
    </div>
  );
};

export default SellDataHeader;
