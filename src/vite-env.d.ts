// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';

    REACT_APP_MOCK_API: string;
  }
}
interface Window {
  Stripe: any;
}
