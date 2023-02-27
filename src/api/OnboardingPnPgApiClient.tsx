import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { EmailString } from '@pagopa/ts-commons/lib/strings';
import { ENV } from '../utils/env';
import {
  BusinessPnpg,
  InstitutionsPnPG,
  PnPGInstitutionLegalAddressResource,
  User,
} from '../../types';
import { createClient, WithDefaultsT } from './generated/b4f-onboarding-pnpg/client';
import { RoleEnum } from './generated/b4f-onboarding-pnpg/UserDto';

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

export const OnboardingPnPgApi = {
  getInstitutionsByUser: async (_loggedUser: User): Promise<InstitutionsPnPG> => {
    const result = await apiClient.getInstitutionsByUserUsingPOST({
      body: {
        taxCode: 'DLLDGI53T30I324E',
        email: 'd.dellavalle@test.it' as EmailString,
        name: 'Diego',
        surname: 'Della Valle',
        role: 'MANAGER' as RoleEnum,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  onboardingPGSubmit: async (
    externalInstitutionId: string,
    productId: string,
    loggedUser: User,
    selectedInstitution: BusinessPnpg
  ): Promise<boolean> => {
    const result = await apiClient.onboardingPGUsingPOST({
      externalInstitutionId,
      productId,
      body: {
        billingData: {
          businessName: selectedInstitution.businessName,
          taxCode: selectedInstitution.businessTaxId,
        },
        users: [
          {
            taxCode: loggedUser.taxCode,
            name: loggedUser.name,
            surname: loggedUser.surname,
            email: loggedUser.email as EmailString,
            role: 'MANAGER' as RoleEnum,
          },
        ],
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  getInstitutionLegalAddress: async (
    externalInstitutionId: string
  ): Promise<PnPGInstitutionLegalAddressResource> => {
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
        email: loggedUser.email as EmailString,
        name: loggedUser.name,
        role: 'MANAGER' as RoleEnum,
        surname: loggedUser.surname,
        taxCode: loggedUser.taxCode,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
