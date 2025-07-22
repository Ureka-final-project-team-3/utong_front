import { useEffect, useState } from 'react';

const useOrderQueue = (dataCode) => {
  const [queueData, setQueueData] = useState({
    buyOrderQuantity: {},
    sellOrderQuantity: {},
    recentContracts: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dataCode) return;

    setIsLoading(true); // 데이터 새로 요청 시 로딩 시작

    const url = `${import.meta.env.VITE_API_BASE_URL}/api/data/order-queue/stream/${dataCode}`;
    const eventSource = new EventSource(url);
    const eventName = `${dataCode}queue-hourly-update`;

    eventSource.addEventListener(eventName, (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setQueueData(parsed);
        setIsLoading(false); // 데이터 수신 완료
        console.log(`[SSE][${dataCode}] 큐 수신:`, parsed);
      } catch (err) {
        console.error(`[SSE][${dataCode}] 파싱 오류`, err);
      }
    });

    eventSource.onerror = (e) => {
      console.error(`[SSE][${dataCode}] SSE 오류`, e);
      // 에러시에도 로딩 해제하거나 필요에 따라 다시 시도 로직 가능
      setIsLoading(false);
    };

    return () => {
      eventSource.close();
      console.log(`[SSE][${dataCode}] 연결 해제`);
    };
  }, [dataCode]);

  return { queueData, isLoading };
};

export default useOrderQueue;
