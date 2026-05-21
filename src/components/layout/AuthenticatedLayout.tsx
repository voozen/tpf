import { Outlet, useLocation } from 'react-router-dom';

import { BottomNav } from '@/components/layout/BottomNav';
import { MobileShell } from '@/components/layout/MobileShell';

const NAV_PATHS = new Set([
  '/home',
  '/groups',
  '/insights',
  '/profile',
  '/add-receipt',
  '/split-items',
  '/add-transfer',
  '/group-dashboard',
  '/settlement-selection',
  '/settlement',
]);

function shouldShowBottomNav(pathname: string): boolean {
  return NAV_PATHS.has(pathname);
}

export function AuthenticatedLayout() {
  const { pathname } = useLocation();
  const showNav = shouldShowBottomNav(pathname);

  return (
    <MobileShell>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <main className={`min-h-0 flex-1 overflow-auto ${showNav ? 'pb-0' : ''}`}>
          <Outlet />
        </main>
        {showNav && <BottomNav />}
      </div>
    </MobileShell>
  );
}
