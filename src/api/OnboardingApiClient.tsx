import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { ENV } from '../utils/env';
import { Company, User } from '../types';
import { store } from '../redux/store';
import { createClient, WithDefaultsT } from './generated/b4f-onboarding/client';
import { InstitutionTypeEnum } from './generated/b4f-onboarding/CompanyOnboardingDto';
import { RoleEnum, CompanyUserDto } from './generated/b4f-onboarding/CompanyUserDto';
import { InstitutionOnboardingResource } from './generated/b4f-onboarding/InstitutionOnboardingResource';
import { VerifyManagerResponse } from './generated/b4f-onboarding/VerifyManagerResponse';
import { CheckManagerResponse } from './generated/b4f-onboarding/CheckManagerResponse';
import { ManagerInfoResponse } from './generated/b4f-onboarding/ManagerInfoResponse';
import { UserTaxCodeDto } from './generated/b4f-onboarding/UserTaxCodeDto';
import { UserId } from './generated/b4f-onboarding/UserId';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
      ...params,
      bearerAuth: `Bearer ${token}`,
    });
  };

const apiClient = createClient({
  baseUrl: ENV.URL_API.ONBOARDING_V2,
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
  verifyManager: async (companyTaxCode: string): Promise<VerifyManagerResponse> => {
    const result = await apiClient.verifyManagerUsingPOST({
      body: { companyTaxCode },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getManagerInfo: async (onboardingId: string): Promise<ManagerInfoResponse> => {
    const result = await apiClient.getManagerInfo({ onboardingId });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitutionOnboardingInfo: async (
    taxCode: string,
    productId: string
  ): Promise<Array<InstitutionOnboardingResource>> => {
    const result = await apiClient.getActiveOnboardingUsingGET({
      taxCode,
      productId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  searchUser: async (taxCode: UserTaxCodeDto): Promise<UserId> => {
    const result = await apiClient.searchUserId({ body: taxCode });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  checkManager: async (userId: string, taxCode?: string): Promise<CheckManagerResponse> => {
    const result = await apiClient.checkManager({
      body: {
        institutionType: 'PG' as InstitutionTypeEnum,
        productId: 'prod-pn-pg',
        taxCode,
        userId,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  onboardingPGSubmit: async (
    businessId: string,
    productId: string,
    loggedUser: CompanyUserDto,
    selectedBusiness: Company,
    digitalAddress: string
  ): Promise<boolean> => {
    const result = await apiClient.institutionOnboardingCompany({
      body: {
        productId,
        billingData: {
          certified: selectedBusiness.origin === 'INFOCAMERE',
          businessName: selectedBusiness.companyName ?? '',
          taxCode: selectedBusiness.companyTaxCode,
          digitalAddress,
        },
        institutionType: 'PG' as InstitutionTypeEnum,
        taxCode: businessId,
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

  onboardingUsers: async (taxCode: string, certified: boolean, user: User): Promise<boolean> => {
    const result = await apiClient.onboardingUsersPgUsingPOST({
      body: {
        certified,
        institutionType: 'PG' as InstitutionTypeEnum,
        productId: 'prod-pn-pg',
        taxCode,
        users: [{ ...user, role: 'MANAGER' as RoleEnum }],
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
