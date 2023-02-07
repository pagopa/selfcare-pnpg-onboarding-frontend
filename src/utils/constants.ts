import { RoutesObject } from '../../types';
import Dashboard from '../views/dashboard/Dashboard';
import OnboardingPNPG from '../views/OnboardingPNPG/OnboardingPNPG';
import { ENV } from './env';

const IS_DEVELOP = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export const DISPLAY_LOGS: boolean = IS_DEVELOP;
export const MOCK_USER: boolean = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTES: RoutesObject = {
  ONBOARDING_PNPG_ROOT: {
    PATH: '/onboarding-pnpg',
    LABEL: 'Onboarding-pnpg',
    EXACT: true,
    COMPONENT: OnboardingPNPG,
  },
  DASHBOARD: {
    PATH: '/dashboardpg',
    LABEL: 'Onboarding-pnpg dashboard',
    EXACT: false,
    COMPONENT: Dashboard,
  },
};

export const API = {
  GET_INSTITUTIONS_BY_USER_ID: {
    URL: ENV.URL_API.ONBOARDING + '/pnPGInstitutions',
  },
  ONBOARDING_PNPG_SUBMIT: {
    URL:
      ENV.URL_API.ONBOARDING +
      '/pnPGInstitutions/{{externalInstitutionId}}/products/{{productId}}/onboarding',
  },
  DASHBOARD_PNPG_RETRIEVE_PARTY_INFOS: {
    URL: ENV.URL_API.DASHBOARD + 'pnPGInstitutions/{{externalId}}',
  },
  DASHBOARD_RETRIEVE_BACK_OFFICE_URL: {
    URL: ENV.URL_API.DASHBOARD + 'products/{{productId}}/back-office',
  },
  DASHBOARD_SAVE_INSTITUTION_LOGO: {
    URL: ENV.URL_API.DASHBOARD + 'institutions/{{institutionId}}/logo',
  },
  DASHBOARD_GET_INSTITUTIONS: {
    URL: ENV.URL_API.DASHBOARD + 'pnPGInstitutions',
  },
};
