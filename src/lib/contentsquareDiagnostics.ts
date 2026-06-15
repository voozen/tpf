function hostnameAllowed(
  hostname: string,
  hostnames: string[] | undefined,
  allowSubdomains?: number | boolean,
): boolean {
  if (!hostnames?.length) return false;

  // Contentsquare uses hostnames: [""] + allowSubdomains: 1 for "any domain".
  const onlyEmpty = hostnames.every((entry) => !entry);
  if (onlyEmpty && (allowSubdomains === 1 || allowSubdomains === true)) return true;

  return hostnames.some((allowed) => {
    if (!allowed) return false;
    if (allowed.startsWith('.')) {
      const bare = allowed.slice(1);
      return hostname === bare || hostname.endsWith(allowed);
    }
    return hostname === allowed || hostname.endsWith(`.${allowed}`);
  });
}

export function logContentsquareDiagnostics(): void {
  if (typeof window === 'undefined') return;

  window.setTimeout(() => {
    const hostname = window.location.hostname;

    if (typeof CS_CONF === 'undefined') {
      console.warn(
        '[BudgetSplit / Contentsquare] Tag not loaded. Check adblock and Network for 92aaa8cb4b693.js',
      );
      return;
    }

    const allowed = hostnameAllowed(hostname, CS_CONF.hostnames, CS_CONF.allowSubdomains);
    const hostnames = CS_CONF.hostnames?.join(', ') || '(none)';

    if (!allowed) {
      console.error(
        `[BudgetSplit / Contentsquare] DOMENA NIE AUTORYZOWANA\n` +
          `  Bieżąca: ${hostname}\n` +
          `  Dozwolone w projekcie: [${hostnames}]\n` +
          `  → W Hotjar/Contentsquare: Site settings → ustaw URL na https://tpf-budgetsplit.web.app\n` +
          `  → Dodaj też localhost do testów lokalnych\n` +
          `  Bez tego sesje = 0 w dashboardzie (tag jest, dane nie lecą).`,
      );
      return;
    }

    if (CS_CONF.status !== 1) {
      console.warn(`[BudgetSplit / Contentsquare] status=${CS_CONF.status} (oczekiwane: 1)`);
      return;
    }

    console.info(
      `[BudgetSplit / Contentsquare] OK — project ${CS_CONF.projectId}, hostname ${hostname} authorized`,
    );
  }, 2500);
}
