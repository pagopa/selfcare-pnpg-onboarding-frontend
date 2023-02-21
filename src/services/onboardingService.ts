import { BusinessPnpg, InstitutionsPnPG, User } from '../../types';
import { OnboardingPnPgApi } from '../api/OnboardingPnPgApiClient';
import {
  mockedOnboardingPnPgApi,
  mockedRetrievedInstitutionLegalAddress,
} from '../api/__mocks__/OnboardingPnPgApiClient';
import { mockedInstitutionPnPG } from '../api/__mocks__/DashboardPnPgApiClient';
import { DashboardPnPgApi } from '../api/DashboardPnPgApiClient';

export const getInstitutionsByUser = (user: User): Promise<InstitutionsPnPG> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve(mockedInstitutionPnPG));
  } else {
    return OnboardingPnPgApi.getInstitutionsByUser(user);
  }
};

export const matchInstitutionAndUser = (
  externalInstitutionId: string,
  loggedUser: User
): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingPnPgApi.matchInstitutionAndUser(externalInstitutionId, loggedUser);
  } else {
    return OnboardingPnPgApi.matchInstitutionAndUser(externalInstitutionId, loggedUser);
  }
};

export const getInstitutionLegalAddress = (
  externalInstitutionId: string
): Promise<PnPGInstitutionLegalAddressResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingPnPgApi.getInstitutionLegalAddress(externalInstitutionId);
  } else {
    return OnboardingPnPgApi.getInstitutionLegalAddress(externalInstitutionId);
  }
};

export const onboardingPGSubmit = (
  externalInstitutionId: string,
  productId: string,
  loggedUser: User,
  selectedInstitution: BusinessPnpg
): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingPnPgApi.onboardingPGSubmit(externalInstitutionId);
  } else {
    return OnboardingPnPgApi.onboardingPGSubmit(
      externalInstitutionId,
      productId,
      loggedUser,
      selectedInstitution
    );
  }
};

export const getInstitutionLegalAddress = (
  externalInstitutionId: string
): Promise<PnPGInstitutionLegalAddressResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    const matchedInstitutionLegalAddress = mockedRetrievedInstitutionLegalAddress.find(
      (a) => a.externalInstitutionId === externalInstitutionId
    );
    return new Promise((resolve) =>
      resolve(matchedInstitutionLegalAddress ?? mockedRetrievedInstitutionLegalAddress[0])
    );
  } else {
    return DashboardPnPgApi.getInstitutionLegalAddress(externalInstitutionId);
  }
};

export const matchInstitutionAndUser = (
  externalInstitutionId: string,
  loggedUser: User
): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve(true));
  } else {
    return OnboardingPnPgApi.matchInstitutionAndUser(externalInstitutionId, loggedUser);
  }
};
