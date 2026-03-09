import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const processEnvVars: Record<string, string> = {
    NODE_ENV: mode === 'production' ? 'production' : 'development',
    ...Object.fromEntries(
      Object.entries(env).filter(([k]) => k.startsWith('REACT_APP_') || k === 'PUBLIC_URL')
    ),
  };

  return {
    plugins: [
      react(),
      // Plugin per sostituire %REACT_APP_*% nell'HTML
      {
        name: 'html-react-app-env',
        transformIndexHtml(html: string) {
          return html.replace(
            /%REACT_APP_([^%]+)%/g,
            (_match, key: string) => env[`REACT_APP_${key}`] ?? ''
          );
        },
      },
    ],
    base: '/onboarding',
    build: {
      outDir: 'build',
    },
    envPrefix: 'REACT_APP_',
    // process.env viene polyfillato per compatibilità con env-var
    define: {
      'process.env': JSON.stringify(processEnvVars),
    }
  };
});
