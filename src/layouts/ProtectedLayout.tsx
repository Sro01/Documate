import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import AdminSidebarContent from '../components/layout/AdminSidebarContent';
import Header from '../components/layout/Header';

interface ProtectedLayoutProps {
  isAuthenticated?: boolean;
}

function ProtectedLayout({ isAuthenticated = true }: ProtectedLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen bg-white overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}>
        <AdminSidebarContent isCollapsed={isCollapsed} />
      </Sidebar>
      <div className={`flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default ProtectedLayout;
