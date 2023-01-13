import { RoutesObject } from '../../types';
import { ENV } from './env';

const IS_DEVELOP = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export const DISPLAY_LOGS: boolean = IS_DEVELOP;
export const MOCK_USER: boolean = IS_DEVELOP;

export const BASE_ROUTE = ENV.PUBLIC_URL;

export const ROUTES: RoutesObject = {
  /*
  ONBOARDING_PNPG_ROOT: {
    PATH: `${BASE_ROUTE}/`,
    LABEL: 'Onboarding-pnpg',
    EXACT: true,
    COMPONENT: , // TODO Insert here new component 
  }, */
};

export const API = {
  // TODO Insert here api calls
  ONBOARDING_USER_VALIDATION: {
    URL: ENV.URL_API.ONBOARDING + '/users/validate',
  },
};
