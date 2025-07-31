import { create } from 'zustand';

const useLivePriceStore = create((set) => ({
  allPriceMap: {}, // { dataCode: avgPerHourList[] }
  isConnected: false,

  setAllPriceMap: (newMap) => set({ allPriceMap: { ...newMap } }),

  updatePriceMap: (updates) =>
    set((state) => {
      const updatedMap = { ...state.allPriceMap };
      updates.forEach(({ dataCode, avgPerHourList }) => {
        const prevList = updatedMap[dataCode] || [];
        updatedMap[dataCode] = [...prevList.slice(-9), ...avgPerHourList];
      });
      return { allPriceMap: updatedMap };
    }),

  setIsConnected: (connected) => set({ isConnected: connected }),
}));

export default useLivePriceStore;
