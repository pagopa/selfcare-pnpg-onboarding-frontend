import { RoutesObject } from './types';
import { ENV } from './utils/env';
import OnboardingPNPG from './views/OnboardingPNPG/OnboardingPNPG';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTES: RoutesObject = {
  PNPG_ONBOARDING: {
    PATH: '/onboarding',
    LABEL: 'Onboarding PNPG',
    EXACT: true,
    COMPONENT: OnboardingPNPG,
  },
};
