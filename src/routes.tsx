import { RoutesObject } from './types';
import { ENV } from './utils/env';
import Onboarding from './views/Onboarding/Onboarding';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTES: RoutesObject = {
  ONBOARDING: {
    PATH: '/onboarding',
    LABEL: 'Onboarding',
    EXACT: true,
    COMPONENT: Onboarding,
  },
};
