import { storageTokenOps } from '@pagopa/selfcare-common-frontend/utils/storage';
import { buildFetchApi, extractResponse } from '@pagopa/selfcare-common-frontend/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/redux/slices/appStateSlice';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { ENV } from '../utils/env';
import { Business, LegalEntity, BusinessLegalAddress, User } from '../types';
import { store } from '../redux/store';
import { createClient, WithDefaultsT } from './generated/b4f-onboarding-pnpg/client';
import { PnPGUserDto, RoleEnum } from './generated/b4f-onboarding-pnpg/PnPGUserDto';

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

export const OnboardingApi = {
  getBusinessesByUser: async (loggedUser: User): Promise<LegalEntity> => {
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
    businessId: string,
    productId: string,
    loggedUser: PnPGUserDto,
    selectedBusiness: Business,
    digitalAddress: string
  ): Promise<boolean> => {
    const result = await apiClient.onboardingPGUsingPOST({
      externalInstitutionId: businessId,
      productId,
      body: {
        billingData: {
          certified: selectedBusiness.certified,
          businessName: selectedBusiness.businessName,
          taxCode: selectedBusiness.businessTaxId,
          digitalAddress,
        },
        users: [
          {
            taxCode: loggedUser.taxCode,
            name: loggedUser.name,
            surname: loggedUser.surname,
            email: loggedUser.email,
            role: 'MANAGER' as RoleEnum,
          },
        ],
      },
    });
    return extractResponse(result, 201, onRedirectToLogin);
  },

  getBusinessLegalAddress: async (businessId: string): Promise<BusinessLegalAddress> => {
    const result = await apiClient.getInstitutionLegalAddressUsingGET({
      externalInstitutionId: businessId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  matchBusinessAndUser: async (businessId: string, loggedUser: User): Promise<boolean> => {
    const result = await apiClient.matchInstitutionAndUserUsingPOST({
      externalInstitutionId: businessId,
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
