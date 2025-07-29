// 📁 SellSuccessModalTestPage.jsx

import React, { useState } from 'react';
import SellSuccessModal from '../SellDataPage/components/SellSuccessModal';
import BuySuccessModal from '../BuyDataPage/components/BuySuccessModal';
import SellPaymentCompleteModal from '../SellDataPage/components/SellPaymentCompleteModal';
import PaymentCompleteModal from '../BuyDataPage/components/PaymentCompleteModal';
import SellFailModal from '../SellDataPage/components/SellFailModal';
import BuyFailModal from '../BuyDataPage/components/BuyFailModal';

const SellSuccessModalTestPage = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => setShow(true)}>
        실패 모달 열기
      </button>

      <SellFailModal
        show={show}
        message="테스트용 실패 메시지입니다.\n줄바꿈도 확인해 주세요."
        onClose={() => setShow(false)}
      />
    </div>
  );
};

export default SellSuccessModalTestPage;
