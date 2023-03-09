import { DashboardPnPgApi } from '../api/DashboardPnPgApiClient';
import { mockedPnPGInstitutionsResource } from '../api/__mocks__/DashboardPnPgApiClient';
import { institutionPnPGResource2PartyPnpg, PartyPnpg } from '../types';

export const getPnPGInstitutions = (): Promise<Array<PartyPnpg>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve(mockedPnPGInstitutionsResource));
  } else {
    return DashboardPnPgApi.getPnPGInstitutions().then((institutions) =>
      institutions ? institutions.map(institutionPnPGResource2PartyPnpg) : []
    );
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
