declare global {
  interface Window {
    _uxa?: unknown[][];
  }
}

const TRACKING_TIMEOUT_MS = 15_000;

function pushToUxa(...args: unknown[]) {
  window._uxa = window._uxa || [];
  window._uxa.push(args);
}

function sendPageview(path: string) {
  pushToUxa('setPath', path);
  pushToUxa('trackPageview', path);
}

/** Contentsquare / Hotjar SPA pageview (see Contentsquare artificial pageviews docs). */
export function trackContentsquarePageview(path: string): void {
  if (typeof CS_CONF !== 'undefined') {
    sendPageview(path);
    return;
  }

  const startedAt = Date.now();
  const intervalId = window.setInterval(() => {
    if (typeof CS_CONF !== 'undefined') {
      window.clearInterval(intervalId);
      sendPageview(path);
      return;
    }

    if (Date.now() - startedAt >= TRACKING_TIMEOUT_MS) {
      window.clearInterval(intervalId);
      // Queue anyway — processed when script finishes loading
      sendPageview(path);
    }
  }, 200);
}
