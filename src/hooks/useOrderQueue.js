import { useEffect, useState } from 'react';
import useOrderQueueStore from '@/stores/useOrderQueueStore';

const useOrderQueue = (dataCode) => {
  const allQueueData = useOrderQueueStore(state => state.allQueueData);
  const [queueData, setQueueData] = useState({
    buyOrderQuantity: {},
    sellOrderQuantity: {},
    recentContracts: [],
  });
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  if (!dataCode) return;

  const target = allQueueData.find(d => d.dataCode === dataCode);
  if (target) {
    setQueueData(target);
    setIsLoading(false);
    console.log('queueData 업데이트 됨:', target);  // 여기에 로그 추가
  } else {
    setIsLoading(true);
    console.log('dataCode에 해당하는 데이터 없음:', dataCode);
  }
}, [allQueueData, dataCode]);


  return { queueData, isLoading };
};

export default useOrderQueue;
