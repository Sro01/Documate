import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../admin/profile/ProfileCard';
import Dropdown from '../common/Dropdown';
import NavItem from './NavItem';
import SubMenuItem from './SubMenuItem';
import { ROUTES } from '../../constants/routes';

interface AdminSidebarContentProps {
  isCollapsed: boolean;
}

function AdminSidebarContent({ isCollapsed }: AdminSidebarContentProps) {
  const [isLoggedIn] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {!isCollapsed && (
          <ProfileCard
            userName="김길동"
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>

      <nav className="mt-4 flex-1">
        <Dropdown
          isCollapsed={isCollapsed}
          trigger={
            <NavItem
              icon="🤖"
              label="챗봇 리스트"
              hasDropdown={true}
            />
          }
        >
          <SubMenuItem label="챗봇 목록 보기" onClick={() => navigate(ROUTES.ADMIN.CHATBOT_LIST)} />
          <SubMenuItem label="챗봇 생성" onClick={() => navigate(ROUTES.ADMIN.CHATBOT_CREATE)} />
        </Dropdown>

        <Dropdown
          isCollapsed={isCollapsed}
          trigger={
            <NavItem
              icon="📊"
              label="챗봇 통계"
              hasDropdown={true}
            />
          }
        >
          <SubMenuItem label="통계 대시보드" />
          <SubMenuItem label="분석 리포트" />
        </Dropdown>

        <Dropdown
          isCollapsed={isCollapsed}
          trigger={
            <NavItem
              icon="⚙️"
              label="설정"
              hasDropdown={true}
            />
          }
        >
          <SubMenuItem label="가입 신청 관리" onClick={() => navigate(ROUTES.ADMIN.SIGNUP_MANAGEMENT)} />
          <SubMenuItem label="관리자 목록" onClick={() => navigate(ROUTES.ADMIN.ADMIN_LIST)}/>
          <SubMenuItem label="프로필 설정" onClick={() => navigate(ROUTES.ADMIN.SETTINGS)} />
        </Dropdown>
      </nav>
    </>
  );
}

export default AdminSidebarContent;
