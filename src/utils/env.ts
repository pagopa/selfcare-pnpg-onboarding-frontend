const PUBLIC_URL_INNER: string | undefined = import.meta.env.VITE_PUBLIC_URL || '/onboarding';

export const ENV = {
  ENV: import.meta.env.VITE_ENV,
  PUBLIC_URL: PUBLIC_URL_INNER,

  URL_INSTITUTION_LOGO: {
    PREFIX: import.meta.env.VITE_URL_INSTITUTION_LOGO_PREFIX,
    SUFFIX: import.meta.env.VITE_URL_INSTITUTION_LOGO_SUFFIX,
  },

  ASSISTANCE: {
    ENABLE: import.meta.env.VITE_ASSISTANCE_ENABLE === 'true',
    EMAIL: import.meta.env.VITE_ASSISTANCE_EMAIL,
  },

  URL_FE: {
    LOGIN: import.meta.env.VITE_URL_FE_LOGIN,
    LOGOUT: import.meta.env.VITE_URL_FE_LOGOUT,
    DASHBOARD: import.meta.env.VITE_URL_FE_DASHBOARD,
    LANDING: import.meta.env.VITE_URL_FE_LANDING,
    ASSISTANCE: import.meta.env.VITE_URL_FE_ASSISTANCE,
  },

  URL_API: {
    ONBOARDING: import.meta.env.VITE_URL_API_ONBOARDING,
    ONBOARDING_V2: import.meta.env.VITE_URL_API_ONBOARDING_V2,
    PARTY_REGISTRY_PROXY: import.meta.env.VITE_URL_API_PARTY_REGISTRY_PROXY,
  },

  MAX_INSTITUTIONS_FETCH: import.meta.env.VITE_MAX_INSTITUTIONS_FETCH,

  UPLOAD_CONTRACT_MAX_LOOP_ERROR: import.meta.env.VITE_UPLOAD_CONTRACT_MAX_LOOP_ERROR,

  ANALYTCS: {
    ENABLE: import.meta.env.VITE_ANALYTICS_ENABLE === 'true',
    MOCK: import.meta.env.VITE_ANALYTICS_MOCK === 'true',
    DEBUG: import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
    TOKEN: import.meta.env.VITE_ANALYTICS_TOKEN,
    API_HOST: import.meta.env.VITE_ANALYTICS_API_HOST,
  },
};
