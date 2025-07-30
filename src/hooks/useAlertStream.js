import { useEffect } from 'react';
import useAlertStore from '@/stores/alertStore';
import { toast } from 'react-toastify';

const useAlertStream = (token) => {
  const addAlert = useAlertStore((state) => state.addAlert);

  const dataCodeMap = {
    '001': 'LTE',
    '002': '5G',
  };

  const requestTypeMap = {
    SALE: '판매완료',
    PURCHASE: '구매완료',
  };

  useEffect(() => {
    if (!token) return;

    const url = `${import.meta.env.VITE_API_BASE_URL}/sse/data/alert`;
    let reader;

    const handleSSEChunk = (chunk) => {
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const raw = line.replace('data:', '').trim();
          try {
            const alert = JSON.parse(raw);
            addAlert(alert);

            const networkName = dataCodeMap[alert.dataCode] || alert.dataCode;
            const requestTypeName = requestTypeMap[alert.requestType] || alert.requestType;
            const toastMsg = `[${requestTypeName}] ${networkName} | ${alert.quantity}GB | ${alert.price.toLocaleString()}P`;

            console.log('[SSE 알림]', toastMsg);
            toast(toastMsg, {
              position: 'top-right',
              autoClose: 5000,
            });
          } catch {
            console.log('[SSE 일반 메시지]', raw);
            toast(`📎 일반 메시지: ${raw}`, { position: 'top-right' });
          }
        }
      }
    };

    const connect = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'text/event-stream',
          },
        });

        console.log('[SSE] 알림 스트림 연결 성공');

        reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            console.log('[SSE] 알림 서버가 연결을 닫았습니다. 3초 후 재접속 시도');
            setTimeout(connect, 3000);
            break;
          }
          const chunk = decoder.decode(value, { stream: true });
          handleSSEChunk(chunk);
        }
      } catch (err) {
        console.error('[SSE] 알림 스트림 오류:', err);
        console.log('[SSE] 알림 스트림 5초 후 재접속 시도');
        setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      if (reader) {
        reader.cancel().catch(() => {});
      }
    };
  }, [token]);
};

export default useAlertStream;
