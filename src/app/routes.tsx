import { Navigate, type RouteObject } from 'react-router-dom';

import { GuestRoute } from '@/components/auth/GuestRoute';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { GuestLayout } from '@/components/layout/GuestLayout';
import {
  ForgotPasswordPage,
  HomePage,
  OnboardingPage,
  PlaceholderPage,
  SignInPage,
  SignUpPage,
  SplashPage,
  UiShowcasePage,
} from '@/pages';
import { GroupsListPage } from '@/pages/groups/GroupsListPage';

const screen = (title: string) => <PlaceholderPage title={title} />;

export const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/splash" replace /> },

  {
    element: <GuestRoute />,
    children: [
      {
        element: <GuestLayout />,
        children: [
      { path: '/splash', element: <SplashPage /> },
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/signin', element: <SignInPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/groups', element: <GroupsListPage /> },

          { path: '/add-receipt', element: screen('Add Receipt') },
          { path: '/split-items', element: screen('Split Items') },
          { path: '/add-transfer', element: screen('Add Transfer') },

          { path: '/group-dashboard', element: screen('Group Dashboard') },
          { path: '/settlement-selection', element: screen('Settle Debts') },
          { path: '/settlement', element: screen('Settlement') },

          { path: '/insights', element: screen('Insights') },
          { path: '/profile', element: screen('Profile') },
        ],
      },
    ],
  },

  { path: '/dev/ui', element: <UiShowcasePage /> },

  { path: '*', element: <Navigate to="/splash" replace /> },
];
