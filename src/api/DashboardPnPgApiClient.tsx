import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { ENV } from '../utils/env';
import { PnPGInstitutionLegalAddressResource } from '../types';
import { createClient, WithDefaultsT } from './generated/b4f-dashboard-pnpg/client';
import { InstitutionPnPGResourceArray } from './generated/b4f-dashboard-pnpg/InstitutionPnPGResourceArray';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: ENV.URL_API.DASHBOARD,
  basePath: '',
  fetchApi: buildFetchApi(),
  withDefaults: withBearerAndInstitutionId,
});

const onRedirectToLogin = () =>
  ENV.STORE.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: ENV.i18n.t('session.expired.title'),
      displayableDescription: ENV.i18n.t('session.expired.message'),
    })
  );

export const DashboardPnPgApi = {
  getPnPGInstitutions: async (): Promise<InstitutionPnPGResourceArray> => {
    const result = await apiClient.getPnPGInstitutionsUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitutionLegalAddress: async (
    externalInstitutionId: string
  ): Promise<PnPGInstitutionLegalAddressResource> => {
    const result = await apiClient.getInstitutionLegalAddressUsingGET({ externalInstitutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  retrieveProductBackoffice: async (
    productId: string,
    institutionId: string,
    environment?: string
  ): Promise<string> => {
    const result = await apiClient.retrieveProductBackofficeUsingGET({
      productId,
      institutionId,
      environment,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  saveInstitutionLogo: async (institutionId: string, logo: File): Promise<boolean> => {
    const result = await apiClient.saveInstitutionLogoUsingPUT({ institutionId, logo });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
