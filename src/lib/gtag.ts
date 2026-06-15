declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const isGtagConfigured = Boolean(measurementId);

/** GA4 pageview on React Router navigation (gtag loaded from index.html). */
export function trackGtagPageview(pagePath: string): void {
  if (!measurementId || typeof window.gtag !== 'function') return;

  window.gtag('config', measurementId, { page_path: pagePath });
}
