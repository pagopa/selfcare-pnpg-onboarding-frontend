import { PnPGInstitutionLegalAddressResource, PnPGInstitutionResource } from '../../types';
import { DashboardPnPgApi } from '../api/DashboardPnPgApiClient';
import { mockedPnPGInstitutionsResource } from '../api/__mocks__/DashboardPnPgApiClient';
import { mockedRetrievedInstitutionLegalAddress } from '../api/__mocks__/OnboardingPnPgApiClient';

// Dashboard API
export const getPnPGInstitutions = (): Promise<Array<PnPGInstitutionResource>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve(mockedPnPGInstitutionsResource));
  } else {
    return DashboardPnPgApi.getPnPGInstitutions().then((p) => p);
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

export const retrieveProductBackoffice = (
  productId: string,
  institutionId: string,
  environment?: string
): Promise<string> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve('dummyUrl'));
  } else {
    return DashboardPnPgApi.retrieveProductBackoffice(productId, institutionId, environment);
  }
};

export const saveInstitutionLogo = (institutionId: string, logo: File): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve(true));
  } else {
    return DashboardPnPgApi.saveInstitutionLogo(institutionId, logo);
  }
};
