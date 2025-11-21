import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import UserSidebarContent from '../components/layout/UserSidebarContent';
import Header from '../components/layout/Header';

function PublicLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // 로그인/회원가입 페이지는 Sidebar와 Header 없이 표시
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
        <UserSidebarContent isCollapsed={isCollapsed} />
      </Sidebar>
      <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default PublicLayout;
