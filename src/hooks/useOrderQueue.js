import { useEffect, useState, useRef } from 'react';

const useOrderQueueAll = () => {
  const [allQueueData, setAllQueueData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/order-queue/stream`;
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onopen = () => {
      setIsConnected(true);
      console.log('SSE 연결됨');
    };

    const handleData = (e) => {
      try {
        const allData = JSON.parse(e.data);
        setAllQueueData(allData);
        console.log('allData from SSE:', allData);

      } catch (err) {
        console.error('SSE 데이터 파싱 오류', err);
      }
    };

    eventSourceRef.current.addEventListener('all-queue-initial-data', handleData);
    eventSourceRef.current.addEventListener('all-queue-hourly-update', handleData);

    eventSourceRef.current.onerror = (e) => {
      console.error('SSE 오류', e);
      setIsConnected(false);
    };

    return () => {
      eventSourceRef.current.close();
      setIsConnected(false);
      console.log('SSE 연결 해제');
    };
  }, []);

  return { allQueueData, isConnected };
};

const useOrderQueue = (dataCode) => {
  const { allQueueData } = useOrderQueueAll();
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
