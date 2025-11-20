import type { RouteObject } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import NotFoundPage from '../pages/error/NotFoundPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ChatbotListPage from '../pages/admin/chatbot/ChatbotListPage';
import ChatbotCreatePage from '../pages/admin/chatbot/ChatbotCreatePage';
import ManualPage from '../pages/admin/chatbot/ManualPage';
import SignupManagementPage from '../pages/admin/signup/SignupManagementPage';
import SettingsPage from '../pages/admin/settings/SettingsPage';

// Public Routes: 인증이 필요 없는 라우트
export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },
];

// Protected Routes: 인증이 필요한 라우트
export const protectedRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "chatbotlist",
        element: <ChatbotListPage />,
      },
      {
        path: "chatbot",
        children: [
          {
            path: "create",
            element: <ChatbotCreatePage />,
          },
          {
            path: ":chatbotId/manual",
            element: <ManualPage />,
          },
        ],
      },
      {
        path: "signup-management",
        element: <SignupManagementPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
];

// 모든 라우트를 결합
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes,
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
