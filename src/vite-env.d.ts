// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />
// eslint-disable-next-line spaced-comment
/// <reference types="vite-plugin-svgr/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';

    VITE_MOCK_API: string;
  }
}
interface Window {
  Stripe: any;
}
