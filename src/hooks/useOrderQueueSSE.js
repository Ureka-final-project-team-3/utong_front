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
      console.log('[useOrderQueue SSE] 연결됨');
    };

    const handleData = (e) => {
      try {
        const allData = JSON.parse(e.data);
        console.log('[useOrderQueue SSE] 데이터 도착:', allData);
        setAllQueueData(allData);  // 내부에서 복사해서 상태 변경 유도
      } catch (err) {
        console.error('[useOrderQueue SSE] 파싱 오류:', err);
      }
    };

    eventSourceRef.current.addEventListener('all-queue-initial-data', handleData);
    eventSourceRef.current.addEventListener('all-queue-hourly-update', handleData);

    eventSourceRef.current.onerror = (e) => {
      console.error('[useOrderQueue SSE] 오류', e);
      setIsConnected(false);
    };

    return () => {
      eventSourceRef.current?.close();
      setIsConnected(false);
      console.log('[useOrderQueue SSE] 연결 해제됨');
    };
  }, [token, setAllQueueData, setIsConnected]);
};

export default useOrderQueueSSE;
