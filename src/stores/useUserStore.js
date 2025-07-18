import { create } from 'zustand';
import { fetchMyInfo, fetchPoint } from '@/apis/mypageApi';

const useUserStore = create((set) => ({
  name: '',
  email: '',
  phoneNumber: '',
  remainingData: 0,
  dataCode: '',
  mileage: 0,
  canSale: 0,

  setUserInfo: (userData) => {
    set({
      name: userData.name ?? '',
      email: userData.email ?? '',
      phoneNumber: userData.phoneNumber ?? '',
      remainingData: userData.remainingData ?? 0,
      dataCode: userData.dataCode ?? '',
      mileage: userData.mileage ?? 0,
      canSale: userData.canSale ?? 0,
    });
  },

  fetchUserData: async () => {
    try {
      const userInfo = await fetchMyInfo();
      console.log('fetchMyInfo 응답:', userInfo);
      const userPoint = await fetchPoint();

      set({
        name: userInfo?.name ?? '',
        email: userInfo?.email ?? '',
        phoneNumber: userInfo?.phoneNumber ?? '',
        remainingData: userInfo?.remainingData ?? 0,
        dataCode: userInfo?.dataCode ?? '',
        mileage: userPoint?.mileage ?? 0,
        canSale: userInfo?.canSale ?? 0,
      });
    } catch (e) {
      console.error('❌ 유저 정보 가져오기 실패:', e);
    }
  },
}));

export default useUserStore;
