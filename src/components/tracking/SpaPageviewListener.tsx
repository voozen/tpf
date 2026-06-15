import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { trackContentsquarePageview } from '@/lib/contentsquare';
import { isGtagConfigured, trackGtagPageview } from '@/lib/gtag';

const contentsquareEnabled = Boolean(
  import.meta.env.VITE_HOTJAR_SCRIPT_URL || import.meta.env.VITE_HOTJAR_SITE_ID,
);

/** GA4 + Contentsquare artificial pageviews on React Router navigation. */
export function SpaPageviewListener() {
  const location = useLocation();
  const path = location.pathname + location.search;
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === path) return;
    previousPath.current = path;

    if (isGtagConfigured) {
      trackGtagPageview(path);
    }

    if (contentsquareEnabled) {
      trackContentsquarePageview(path);
    }
  }, [path]);

  return null;
}
