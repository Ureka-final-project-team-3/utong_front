import { useEffect, useRef } from 'react';
import useOrderQueueStore from '@/stores/useOrderQueueStore';

const useOrderQueueSSE = (token) => {
  const setAllQueueData = useOrderQueueStore(state => state.setAllQueueData);
  const setIsConnected = useOrderQueueStore(state => state.setIsConnected);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/order-queue/stream`;
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onopen = () => {
      setIsConnected(true);
      console.log('useOrderQueueSSE 연결됨');
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
      console.log('SuseOrderQueueSSE 연결 해제');
    };
  }, [setAllQueueData, setIsConnected]);
};

export default useOrderQueueSSE;
