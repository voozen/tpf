import { Navigate, type RouteObject } from 'react-router-dom';

import { GuestRoute } from '@/components/auth/GuestRoute';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { GuestLayout } from '@/components/layout/GuestLayout';
import {
  ForgotPasswordPage,
  HomePage,
  OnboardingPage,
  SignInPage,
  SignUpPage,
  SplashPage,
  UiShowcasePage,
} from '@/pages';
import { AddReceiptPage } from '@/pages/expenses/AddReceiptPage';
import { AddTransferPage } from '@/pages/expenses/AddTransferPage';
import { SplitItemsPage } from '@/pages/expenses/SplitItemsPage';
import { ExpensesPage } from '@/pages/expenses/ExpensesPage';
import { GroupDashboardPage } from '@/pages/groups/GroupDashboardPage';
import { InsightsPage } from '@/pages/insights/InsightsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettlementPage } from '@/pages/settlement/SettlementPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SettlementSelectionPage } from '@/pages/settlement/SettlementSelectionPage';

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
          { path: '/expenses', element: <ExpensesPage /> },
          { path: '/groups', element: <Navigate to="/expenses" replace /> },
          { path: '/group-dashboard', element: <GroupDashboardPage /> },

          { path: '/add-receipt', element: <AddReceiptPage /> },
          { path: '/split-items', element: <SplitItemsPage /> },
          { path: '/add-transfer', element: <AddTransferPage /> },

          { path: '/settlement-selection', element: <SettlementSelectionPage /> },
          { path: '/settlement', element: <SettlementPage /> },

          { path: '/insights', element: <InsightsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },

  { path: '/dev/ui', element: <UiShowcasePage /> },

  { path: '*', element: <NotFoundPage /> },
];
