import { create } from 'zustand';

const useAlertStore = create((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts.slice(0, 10)], // 최대 10개 유지
    })),
  clearAlerts: () => set({ alerts: [] }),
}));

export default useAlertStore;
