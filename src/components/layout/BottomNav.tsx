import { Home, PlusCircle, TrendingUp, User, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { APP_FONT_FAMILY } from '@/lib/constants';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: '/home' },
  { id: 'groups', label: 'Groups', icon: Users, path: '/groups' },
  { id: 'add', label: 'Add', icon: PlusCircle, path: '/add-receipt' },
  { id: 'insights', label: 'Insights', icon: TrendingUp, path: '/insights' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
] as const;

function getActiveTab(pathname: string): string {
  if (pathname === '/home') return 'home';
  if (pathname.startsWith('/groups') || pathname.startsWith('/group-dashboard')) {
    return 'groups';
  }
  if (pathname.startsWith('/add') || pathname.startsWith('/split-items')) return 'add';
  if (pathname === '/insights') return 'insights';
  if (pathname === '/profile') return 'profile';
  if (pathname.startsWith('/settlement')) return 'groups';
  return '';
}

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = getActiveTab(location.pathname);

  return (
    <nav
      className="flex h-16 shrink-0 items-center justify-around border-t border-border bg-white"
      aria-label="Main navigation"
      style={{ fontFamily: APP_FONT_FAMILY }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
            className="flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-1"
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              size={24}
              className={isActive ? 'text-primary' : 'text-[var(--neutral-500)]'}
            />
            <span
              className={`text-[11px] leading-[16px] tracking-[0.4px] ${
                isActive ? 'text-primary' : 'text-[var(--neutral-500)]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
