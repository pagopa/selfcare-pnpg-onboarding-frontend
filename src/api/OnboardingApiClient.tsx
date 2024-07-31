import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import {
  buildFetchApi,
  extractResponse,
} from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { ENV } from '../utils/env';
import { Business, LegalEntity, User } from '../types';
import { store } from '../redux/store';
import { createClient, WithDefaultsT } from './generated/b4f-onboarding-pnpg/client';
import { InstitutionTypeEnum } from './generated/b4f-onboarding-pnpg/CompanyOnboardingDto';
import { RoleEnum, CompanyUserDto } from './generated/b4f-onboarding-pnpg/CompanyUserDto';
import { MatchInfoResultResource } from './generated/b4f-onboarding-pnpg/MatchInfoResultResource';
import { InstitutionLegalAddressResource } from './generated/b4f-onboarding-pnpg/InstitutionLegalAddressResource';
import { InstitutionOnboardingInfoResource } from './generated/b4f-onboarding-pnpg/InstitutionOnboardingInfoResource';

const withBearerAndInstitutionId: WithDefaultsT<'bearerAuth'> =
  (wrappedOperation) => (params: any) => {
    const token = storageTokenOps.read();
    return wrappedOperation({
      ...params,
      bearerAuth: `${token}`,
    });
  };

const apiClientV1 = createClient({
  baseUrl: ENV.URL_API.ONBOARDING,
  basePath: '',
  fetchApi: buildFetchApi(),
  withDefaults: withBearerAndInstitutionId,
});

const apiClientV2 = createClient({
  baseUrl: ENV.URL_API.ONBOARDING_V2.concat('/v2'),
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
  getBusinessesByUser: async (): Promise<LegalEntity> => {
    const result = await apiClientV1.getInstitutionsFromInfocamereUsingGET({});
    return extractResponse(result, 200, onRedirectToLogin);
  },

  onboardingPGSubmit: async (
    businessId: string,
    productId: string,
    loggedUser: CompanyUserDto,
    selectedBusiness: Business,
    digitalAddress: string
  ): Promise<boolean> => {
    const result = await apiClientV2.onboardingUsingPOST({
      body: {
        productId,
        billingData: {
          certified: selectedBusiness.certified,
          businessName: selectedBusiness.businessName,
          taxCode: selectedBusiness.businessTaxId,
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

  getBusinessLegalAddress: async (businessId: string): Promise<InstitutionLegalAddressResource> => {
    const result = await apiClientV1.postVerificationLegalAddressUsingPOST({
      body: {
        taxCode: businessId,
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  matchBusinessAndUser: async (
    businessId: string,
    loggedUser: User
  ): Promise<MatchInfoResultResource> => {
    const result = await apiClientV1.postVerificationMatchUsingPOST({
      body: {
        taxCode: businessId,
        userDto: {
          taxCode: loggedUser.taxCode,
          name: loggedUser.name,
          surname: loggedUser.surname,
          role: 'MANAGER' as RoleEnum,
        },
      },
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },

  getInstitutionOnboardingInfo: async (
    taxCode: string,
    productId: string
  ): Promise<InstitutionOnboardingInfoResource> => {
    const result = await apiClientV1.getInstitutionOnboardingInfoUsingGET({
      taxCode,
      productId,
    });
    return extractResponse(result, 200, onRedirectToLogin);
  },
};
