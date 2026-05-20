import { Outlet } from 'react-router-dom';

import { MobileShell } from '@/components/layout/MobileShell';

export function GuestLayout() {
  return (
    <MobileShell className="bg-white">
      <Outlet />
    </MobileShell>
  );
}
