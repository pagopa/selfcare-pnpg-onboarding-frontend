import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

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
        exclude: [
          // root config files
          '*.config.{ts,js}',
          '.eslintrc.js',
          'Dangerfile.ts',
          'index.d.ts',
          // e2e and scripts
          'e2e/**',
          'openApi/**',
          // entry point
          'src/index.tsx',
          // generated code
          'src/api/generated/**',
          // mock files
          'src/**/__mocks__/**',
          'src/**/*.mock.{ts,tsx}',
          // test files
          'src/setupTests.ts',
          'src/utils/test-utils.tsx',
          'src/**/__tests__/**',
          'src/**/*.test.{ts,tsx}',
          'src/**/*.e2e.{ts,tsx}',
          'src/**/*.spec.{ts,tsx}',
          // configuration & environment
          'src/utils/constants.ts',
          'src/utils/env.ts',
          'src/vite-env.d.ts',
          'src/consentAndAnalyticsConfiguration.ts',
          'src/redux/store.ts',
          'src/routes.tsx',
          'src/lib/context.ts',
          // i18n
          'src/locale/**',
          // type definitions
          'src/types.ts',
          'src/utils/models/**',
        ],
      },
      server: {
        deps: {
          inline: [/@pagopa\/selfcare-common-frontend/, /@pagopa\/mui-italia/],
        },
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
