import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { ENV } from '../utils/env';
import {
  BusinessPnpg,
  InstitutionsPnpg,
  PnpgInstitutionLegalAddressResource,
  User,
} from '../types';
import { store } from '../redux/store';
import { createClient, WithDefaultsT } from './generated/b4f-onboarding-pnpg/client';
import { RoleEnum } from './generated/b4f-onboarding-pnpg/PnPGUserDto';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
      ...params,
      bearerAuth: `${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: ENV.URL_API.ONBOARDING,
  basePath: '',
  fetchApi: buildFetchApi(),
  withDefaults: withBearerAndInstitutionId,
});

const onRedirectToLogin = () =>
  store.dispatch(
    appStateActions.addError({
      id: 'tokenNotValid',
      error: new Error(),
      techDescription: 'token expired or not valid',
      toNotify: false,
      blocking: false,
      displayableTitle: i18n.t('session.expired.title'),
      displayableDescription: i18n.t('session.expired.message'),
    })
  );

export const OnboardingPnPgApi = {
  getInstitutionsByUser: async (loggedUser: User): Promise<InstitutionsPnpg> => {
    const result = await apiClient.getInstitutionsByUserUsingPOST({
      body: {
        taxCode: loggedUser.taxCode,
        name: loggedUser.name,
        surname: loggedUser.surname,
        role: 'MANAGER' as RoleEnum,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  onboardingPGSubmit: async (
    externalInstitutionId: string,
    productId: string,
    loggedUser: User,
    selectedInstitution: BusinessPnpg,
    digitalAddress: string
  ): Promise<boolean> => {
    const result = await apiClient.onboardingPGUsingPOST({
      externalInstitutionId,
      productId,
      body: {
        billingData: {
          certified: selectedInstitution.certified,
          businessName: selectedInstitution.businessName,
          taxCode: selectedInstitution.businessTaxId,
          digitalAddress,
        },
        users: [
          {
            taxCode: loggedUser.taxCode,
            name: loggedUser.name,
            surname: loggedUser.surname,
            role: 'MANAGER' as RoleEnum,
          },
        ],
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  getInstitutionLegalAddress: async (
    externalInstitutionId: string
  ): Promise<PnpgInstitutionLegalAddressResource> => {
    const result = await apiClient.getInstitutionLegalAddressUsingGET({ externalInstitutionId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  matchInstitutionAndUser: async (
    externalInstitutionId: string,
    loggedUser: User
  ): Promise<boolean> => {
    const result = await apiClient.matchInstitutionAndUserUsingPOST({
      externalInstitutionId,
      body: {
        name: loggedUser.name,
        role: 'MANAGER' as RoleEnum,
        surname: loggedUser.surname,
        taxCode: loggedUser.taxCode,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
