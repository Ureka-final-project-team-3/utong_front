import { create } from 'zustand';

const useOrderQueueStore = create((set) => ({
  allQueueData: [],
  isConnected: false,

  // 배열을 새로 복사해서 상태 변경 감지 유도
  setAllQueueData: (data) => set({ allQueueData: [...data] }),

  setIsConnected: (connected) => set({ isConnected: connected }),
}));

export default useOrderQueueStore;
