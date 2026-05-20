import { Navigate, type RouteObject } from 'react-router-dom';

import { PlaceholderPage, UiShowcasePage } from '@/pages';

const screen = (title: string) => <PlaceholderPage title={title} />;

export const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/splash" replace /> },

  { path: '/splash', element: screen('Splash') },
  { path: '/onboarding', element: screen('Onboarding') },
  { path: '/signin', element: screen('Sign In') },
  { path: '/signup', element: screen('Sign Up') },
  { path: '/forgot-password', element: screen('Forgot Password') },

  { path: '/groups', element: screen('Groups') },
  { path: '/home', element: screen('Home') },

  { path: '/add-receipt', element: screen('Add Receipt') },
  { path: '/split-items', element: screen('Split Items') },
  { path: '/add-transfer', element: screen('Add Transfer') },

  { path: '/group-dashboard', element: screen('Group Dashboard') },
  { path: '/settlement-selection', element: screen('Settle Debts') },
  { path: '/settlement', element: screen('Settlement') },

  { path: '/insights', element: screen('Insights') },
  { path: '/profile', element: screen('Profile') },

  { path: '/dev/ui', element: <UiShowcasePage /> },

  { path: '*', element: <Navigate to="/splash" replace /> },
];
