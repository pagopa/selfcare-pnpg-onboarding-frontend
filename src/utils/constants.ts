import { RoutesObject } from '../../types';
import OnboardingPNPG from '../views/OnboardingPNPG/OnboardingPNPG';
import { ENV } from './env';

const IS_DEVELOP = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export const DISPLAY_LOGS: boolean = IS_DEVELOP;
export const MOCK_USER: boolean = IS_DEVELOP;

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTES: RoutesObject = {
  ONBOARDING_PNPG_ROOT: {
    PATH: `/onboarding-pnpg`,
    LABEL: 'Onboarding-pnpg',
    EXACT: true,
    COMPONENT: OnboardingPNPG,
  },
};

export const API = {
  GET_INSTITUTIONS_BY_USER_ID: {
    URL: ENV.URL_API.ONBOARDING + '/pnPGInstitutions/{{userId}}',
  },
};
