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
    } else {
      setIsLoading(true);
    }
  }, [allQueueData, dataCode]);

  return { queueData, isLoading };
};

export default useOrderQueue;
