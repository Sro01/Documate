import { useNavigate } from 'react-router-dom';
import WelcomeTitle from '../../components/common/WelcomeTitle';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';
import { getAdminName } from '../../utils/authStorage';

function AdminMainPage() {
  const adminName = getAdminName() || '관리자';
  const navigate = useNavigate();

  return (
    <main className="flex-1 h-full flex flex-col items-center justify-center gap-6">
      <WelcomeTitle>
        {adminName}님 환영합니다.
      </WelcomeTitle>
      <div className="flex flex-row gap-4">
        <Button className="rounded-full" onClick={() => navigate(ROUTES.ADMIN.CHATBOT_LIST)}>
          챗봇 리스트
        </Button>
        <Button className="rounded-full" onClick={() => navigate(ROUTES.ADMIN.SIGNUP_MANAGEMENT)}>
          가입 신청 관리
        </Button>
        <Button className="rounded-full" onClick={() => navigate(ROUTES.ADMIN.ADMIN_LIST)}>
          관리자 목록
        </Button>
        <Button className="rounded-full" onClick={() => navigate(ROUTES.ADMIN.SETTINGS)}>
          프로필 설정
        </Button>
        <Button className="rounded-full" onClick={() => navigate(ROUTES.ADMIN.STATS)}>
          통계
        </Button>
      </div>
    </main>
  );
}

export default AdminMainPage;
