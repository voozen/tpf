import Hotjar from '@hotjar/browser';
import { useEffect, type ReactNode } from 'react';
import ReactGA from 'react-ga4';

import { AnalyticsListener } from '@/components/tracking/AnalyticsListener';

const hotjarSiteId = import.meta.env.VITE_HOTJAR_SITE_ID;
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

type TrackingProviderProps = {
  children: ReactNode;
};

export function TrackingProvider({ children }: TrackingProviderProps) {
  useEffect(() => {
    if (hotjarSiteId) {
      const siteId = Number(hotjarSiteId);
      if (!Number.isNaN(siteId)) {
        Hotjar.init(siteId, 6);
      }
    }
  }, []);

  useEffect(() => {
    if (measurementId) {
      ReactGA.initialize(measurementId);
    }
  }, []);

  return (
    <>
      {measurementId ? <AnalyticsListener /> : null}
      {children}
    </>
  );
}
