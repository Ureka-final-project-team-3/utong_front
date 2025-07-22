// hooks/useOrderQueue.js
import { useEffect, useState } from 'react';

const useOrderQueue = (dataCode) => {
  const [queueData, setQueueData] = useState({
    buyOrderQuantity: {},
    sellOrderQuantity: {},
    recentContracts: [],
  });

  useEffect(() => {
    if (!dataCode) return;

    const url = `http://54.180.0.98:8080/api/data/order-queue/stream/${dataCode}`;
    const eventSource = new EventSource(url);
    const eventName = `${dataCode}queue-hourly-update`;

    eventSource.addEventListener(eventName, (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setQueueData(parsed);
        console.log(`[SSE][${dataCode}] 큐 수신:`, parsed);
      } catch (err) {
        console.error(`[SSE][${dataCode}] 파싱 오류`, err);
      }
    });

    eventSource.onerror = (e) => {
      console.error(`[SSE][${dataCode}] SSE 오류`, e);
    };

    return () => {
      eventSource.close();
      console.log(`[SSE][${dataCode}] 연결 해제`);
    };
  }, [dataCode]);

  return queueData;
};

export default useOrderQueue;
