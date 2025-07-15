import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dummyNotifications = [
  { id: 1, text: '고객님의 데이터가 판매되었어요!', date: '2025.07.01' },
  { id: 2, text: '고객님의 데이터가 구매되었어요!', date: '2025.06.25' },
  { id: 3, text: '고객님의 데이터가 판매되었어요!', date: '2025.06.25' },
  { id: 4, text: '고객님의 데이터가 구매되었어요!', date: '2025.06.25' },
  { id: 5, text: '고객님의 데이터가 판매되었어요!', date: '2025.07.01' },
  { id: 6, text: '고객님의 데이터가 구매되었어요!', date: '2025.06.25' },
  { id: 7, text: '고객님의 데이터가 판매되었어요!', date: '2025.06.25' },
  { id: 8, text: '고객님의 데이터가 구매되었어요!', date: '2025.06.25' },
];

const NotificationsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F6F7FC] ">
      {/* 헤더 */}
      <div className="relative flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="text-black" />
        </button>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-black">
          알림함
        </h2>
        <Bell size={22} className="text-black" />
      </div>

      {/* 알림 리스트 */}
      <div className="space-y-5 mt-4">
        {dummyNotifications.map((item) => (
          <div key={item.id} className="text-sm text-gray-700">
            <p className="mb-1">{item.text}</p>
            <p className="text-xs text-gray-400">{item.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
