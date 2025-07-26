import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton/BackButton';
import { fetchMyInfo } from '@/apis/mypageApi';
import { Mail, Lock, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
const EditProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyInfo()
      .then((data) => setUser(data))
      .catch((error) => {
        console.error('유저 정보 불러오기 실패:', error);
      });
  }, []);

  if (!user) {
    return <div className="text-center mt-10 text-gray-600">불러오는 중...</div>;
  }

  return (
    <div>
      {/* 헤더 */}
      <div className="relative flex items-center justify-between mb-6">
        <BackButton onClick={() => navigate(-1)} />
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
          정보수정
        </h2>
        <div className="w-6" />
      </div>

      {/* 기본 정보 카드 */}
      <div className="bg-white rounded-xl p-4  border border-gray-300">
        <div className="text-base text-gray-500 mb-2">기본정보</div>

        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold">{user.name}</div>
          <div className="text-base text-gray-700 space-x-3">
            <span>포인트 {user.mileage?.toLocaleString() ?? 0}P</span>
            <span>데이터 {user.remainingData ?? 0}GB</span>
          </div>
        </div>
        <div className="w-full h-px bg-gray-200 my-3" />
        {/* 이메일 */}
        <div className="flex items-center gap-2 text-base text-gray-800 mb-3">
          <Mail size={16} className="text-gray-500" />
          <span>아이디</span>
          <span className="ml-auto">{user.email}</span>
        </div>

        {/* 비밀번호 */}
        <div className="flex items-center gap-2 text-base text-gray-800 mb-3">
          <Lock size={16} className="text-gray-500" />
          <span>비밀번호</span>
          <span className="ml-auto">**********</span>
          <button
            onClick={() => navigate('/find-password')}
            className="text-base text-blue-600 font-semibold hover:text-blue-800 hover:underline cursor-pointer"
          >
            수정
          </button>
        </div>

        {/* 휴대전화 */}
        <div className="flex items-center gap-2 text-base text-gray-800">
          <Smartphone size={16} className="text-gray-500" />
          <span>휴대전화</span>
          <span className="ml-auto">{user.phoneNumber ?? '미입력'}</span>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
