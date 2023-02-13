import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { EmailString } from '@pagopa/ts-commons/lib/strings';
import { ENV } from '../utils/env';
import { BusinessPnpg, InstitutionsPnPG, User } from '../../types';
import { createClient, WithDefaultsT } from './generated/b4f-onboarding-pnpg/client';
import { RoleEnum } from './generated/b4f-onboarding-pnpg/UserDto';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
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
  getInstitutionsByUser: async (loggedUser: User): Promise<InstitutionsPnPG> => {
    const result = await apiClient.getInstitutionsByUserUsingPOST({
      body: {
        taxCode: loggedUser.taxCode,
        email: loggedUser.email as EmailString,
        name: loggedUser.name,
        surname: loggedUser.surname,
        role: '' as RoleEnum,
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
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
