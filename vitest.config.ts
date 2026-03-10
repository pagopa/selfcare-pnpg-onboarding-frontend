import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode ?? 'test', process.cwd(), '');

  return {
    plugins: [svgr(), react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      coverage: {
        provider: 'v8',
        exclude: ['src/index.tsx', 'src/api/generated/**'],
      },
    },
    define: {
      'process.env': JSON.stringify({
        NODE_ENV: 'test',
        ...Object.fromEntries(
          Object.entries(env).filter(([k]) => k.startsWith('VITE_') || k === 'PUBLIC_URL')
        ),
      }),
    },
  };
});
