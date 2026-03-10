import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const processEnvVars: Record<string, string> = {
    NODE_ENV: mode === 'production' ? 'production' : 'development',
    ...Object.fromEntries(
      Object.entries(env).filter(([k]) => k.startsWith('VITE_') || k === 'PUBLIC_URL')
    ),
  };

  return {
    plugins: [
      svgr(),
      react(),
      {
        name: 'html-react-app-env',
        transformIndexHtml(html: string) {
          return html.replace(
            /%VITE_([^%]+)%/g,
            (_match, key: string) => env[`VITE_${key}`] ?? ''
          );
        },
      },
    ],
    base: '/onboarding',
    build: {
      outDir: 'dist',
    },
    envPrefix: 'VITE_',
    define: {
      'process.env': JSON.stringify(processEnvVars),
    }
  };
});
