import { RoutesObject } from '../types';
import OnboardingPNPG from '../views/OnboardingPNPG/OnboardingPNPG';
import { ENV } from './env';

const IS_DEVELOP = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export const DISPLAY_LOGS: boolean = IS_DEVELOP;
export const MOCK_USER: boolean = IS_DEVELOP;
export const LOG_REDUX_ACTIONS = IS_DEVELOP;

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTES: RoutesObject = {
  PNPG_ONBOARDING: {
    PATH: '/onboarding-pnpg',
    LABEL: 'Onboarding-pnpg',
    EXACT: true,
    COMPONENT: OnboardingPNPG,
  },
};
