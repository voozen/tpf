const SCRIPT_URL = import.meta.env.VITE_HOTJAR_SCRIPT_URL;
const SITE_ID = import.meta.env.VITE_HOTJAR_SITE_ID;

/** Legacy SDK path only; Contentsquare script is injected in index.html at build time. */
export function loadHotjar(): void {
  if (SCRIPT_URL) return;

  if (SITE_ID) {
    void import('@hotjar/browser').then(({ default: Hotjar }) => {
      const id = Number(SITE_ID);
      if (!Number.isNaN(id)) {
        Hotjar.init(id, 6);
      }
    });
  }
}

export const isHotjarConfigured = Boolean(SCRIPT_URL || SITE_ID);
