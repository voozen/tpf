import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function googleAnalyticsGtagPlugin(measurementId: string | undefined): Plugin {
  return {
    name: 'inject-google-analytics-gtag',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!measurementId || html.includes(`gtag/js?id=${measurementId}`)) return html;

        const gtag = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    </script>`;

        return html.replace('<head>', `<head>${gtag}`);
      },
    },
  };
}

function contentsquareBootstrapPlugin(scriptUrl: string | undefined): Plugin {
  return {
    name: 'inject-contentsquare-bootstrap',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!scriptUrl || html.includes(scriptUrl)) return html;

        const bootstrap = `
    <script>
      window._uxa = window._uxa || [];
      window._uxa.push([
        "setPath",
        window.location.pathname + window.location.search + window.location.hash.replace("#", "?__"),
      ]);
    </script>
    <script async src="${scriptUrl}"></script>`;

        return html.replace('<head>', `<head>${bootstrap}`);
      },
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const contentsquareScriptUrl = env.VITE_HOTJAR_SCRIPT_URL;
  const gaMeasurementId = env.VITE_GA_MEASUREMENT_ID;

  return {
    plugins: [
      googleAnalyticsGtagPlugin(gaMeasurementId),
      contentsquareBootstrapPlugin(contentsquareScriptUrl),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
