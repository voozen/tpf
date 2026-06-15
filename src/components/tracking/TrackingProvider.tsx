import { useEffect, type ReactNode } from 'react';

import { SpaPageviewListener } from '@/components/tracking/SpaPageviewListener';
import { logContentsquareDiagnostics } from '@/lib/contentsquareDiagnostics';
import { isGtagConfigured } from '@/lib/gtag';
import { loadHotjar } from '@/lib/loadHotjar';

const hotjarEnabled = Boolean(
  import.meta.env.VITE_HOTJAR_SCRIPT_URL || import.meta.env.VITE_HOTJAR_SITE_ID,
);

type TrackingProviderProps = {
  children: ReactNode;
};

export function TrackingProvider({ children }: TrackingProviderProps) {
  useEffect(() => {
    loadHotjar();
    logContentsquareDiagnostics();
  }, []);

  return (
    <>
      {isGtagConfigured || hotjarEnabled ? <SpaPageviewListener /> : null}
      {children}
    </>
  );
}
