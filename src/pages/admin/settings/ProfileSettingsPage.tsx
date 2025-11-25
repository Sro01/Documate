import { useState, useEffect } from 'react';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import { useGetMe } from '../../../hooks/auth/useAuth';

function ProfileSettingsPage() {
  const [profileData, setProfileData] = useState({
    admin_id: '',
    username: '',
    name: '',
    created_at: '',
    last_login_at: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const { getMe } = useGetMe();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    const data = await getMe();
    if (data) {
      setProfileData({
        admin_id: data.admin_id,
        username: data.username,
        name: data.name,
        created_at: data.created_at || '',
        last_login_at: data.last_login_at || '',
      });
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePasswordChange = () => {
    // TODO: 비밀번호 변경 모달 또는 페이지로 이동
    alert('비밀번호 변경 기능은 준비 중입니다.');
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-8">
        <PageHeader title="프로필 설정" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8">
      <PageHeader title="프로필 설정" />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <div className="space-y-6">
          {/* 관리자 ID */}
          {/* <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">관리자 ID</label>
            <div className="flex-1">
              <p className="text-gray-900">{profileData.admin_id}</p>
            </div>
          </div> */}

          {/* 아이디 */}
          <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">아이디</label>
            <div className="flex-1">
              <p className="text-gray-900">{profileData.username}</p>
            </div>
          </div>

          {/* 이름 */}
          <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">이름</label>
            <div className="flex-1">
              <p className="text-gray-900">{profileData.name}</p>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">비밀번호</label>
            <div className="flex-1 flex items-center gap-3">
              <p className="text-gray-900">••••••••</p>
              <Button size="small" variant="outline" onClick={handlePasswordChange}>
                비밀번호 변경
              </Button>
            </div>
          </div>

          {/* 가입 일시 */}
          <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">가입 일시</label>
            <div className="flex-1">
              <p className="text-gray-900">{formatDate(profileData.created_at)}</p>
            </div>
          </div>

          {/* 마지막 로그인 */}
          <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">마지막 로그인</label>
            <div className="flex-1">
              <p className="text-gray-900">{formatDate(profileData.last_login_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProfileSettingsPage;
