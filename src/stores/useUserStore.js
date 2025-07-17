import { create } from 'zustand';
import { fetchMyInfo, fetchPoint } from '@/apis/mypageApi'; // ✅ 이거 빠져있었음

const useUserStore = create((set) => ({
  name: '',
  email: '',
  phoneNumber: '',
  remainingData: 0,
  dataCode: '',
  mileage: 0,

  setUserInfo: (userData) => {
    set({
      name: userData.name ?? '',
      email: userData.email ?? '',
      phoneNumber: userData.phoneNumber ?? '',
      remainingData: userData.remainingData ?? 0,
      dataCode: userData.dataCode ?? '',
      mileage: userData.mileage ?? 0,
    });
  },

  fetchUserData: async () => {
    try {
      const userInfo = await fetchMyInfo();
      const userPoint = await fetchPoint();

      set({
        name: userInfo?.name ?? '',
        email: userInfo?.email ?? '',
        phoneNumber: userInfo?.phoneNumber ?? '',
        remainingData: userInfo?.remainingData ?? 0,
        dataCode: userInfo?.dataCode ?? '',
        mileage: userPoint?.mileage ?? 0,
      });
    } catch (e) {
      console.error('❌ 유저 정보 가져오기 실패:', e);
    }
  },
}));

export default useUserStore;
