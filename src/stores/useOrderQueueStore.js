import { create } from 'zustand';

const useOrderQueueStore = create((set) => ({
  allQueueData: [],
  isConnected: false,
  setAllQueueData: (data) => set({ allQueueData: data }),
  setIsConnected: (connected) => set({ isConnected: connected }),
}));

export default useOrderQueueStore;
