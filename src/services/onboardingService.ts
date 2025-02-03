import { Company, User } from '../types';
import { OnboardingApi } from '../api/OnboardingApiClient';
import { mockedOnboardingApi } from '../api/__mocks__/OnboardingApiClient';
import { CompanyUserDto, RoleEnum } from '../api/generated/b4f-onboarding/CompanyUserDto';
import { InstitutionOnboardingResource } from '../api/generated/b4f-onboarding/InstitutionOnboardingResource';
import { CheckManagerResponse } from '../api/generated/b4f-onboarding/CheckManagerResponse';
import { VerifyManagerResponse } from '../api/generated/b4f-onboarding/VerifyManagerResponse';
import { ENV } from '../utils/env';

export const getInstitutionOnboardingInfo = async (
  taxCode: string,
  productId: string,
  sessionToken?: string
): Promise<Array<InstitutionOnboardingResource> | Response> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.getInstitutionOnboardingInfo(taxCode);
  } else {
    return fetch(
      `${ENV.URL_API.ONBOARDING_V2}/v2/institutions/onboarding/active?taxCode=${taxCode}&productId=${productId}`,
      {
        headers: {
          accept: '*/*',
          'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
          authorization: `Bearer ${sessionToken}`,
        },
        method: 'GET',
        mode: 'cors',
      }
    );
  }
};

export const verifyManager = async (
  companyTaxCode: string,
  userTaxCode: string,
  sessionToken: string
): Promise<VerifyManagerResponse> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.verifyManager(companyTaxCode, userTaxCode);
  } else {
    return fetch(`${ENV.URL_API.ONBOARDING_V2}/v2/institutions/company/verify-manager`, {
      headers: {
        accept: '*/*',
        'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ taxCode: userTaxCode, companyTaxCode }),
    });
  }
};

export const checkManager = async (
  loggedUser: User,
  taxCode?: string
): Promise<CheckManagerResponse> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.checkManager(taxCode);
  } else {
    return OnboardingApi.checkManager(loggedUser, taxCode);
  }
};

export const getManagerOfOnboarding = async (onboardingId: string): Promise<Response | any> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return {
      name: 'Nome',
      surname: 'Cognome',
    };
  } else {
    return OnboardingApi.getManagerInfo(onboardingId);
  }
};

export const onboardingPGSubmit = (
  businessId: string,
  productId: string,
  loggedUser: CompanyUserDto,
  selectedInstitution: Company,
  digitalAddress: string
): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.onboardingPGSubmit(businessId);
  } else {
    return OnboardingApi.onboardingPGSubmit(
      businessId,
      productId,
      {
        name: loggedUser.name,
        surname: loggedUser.surname,
        role: 'MANAGER' as RoleEnum,
        taxCode: loggedUser.taxCode,
        email: loggedUser.email,
      },
      selectedInstitution,
      digitalAddress
    );
  }
};

export const onboardingUsersSubmit = (
  taxCode: string,
  certified: boolean,
  user: User
): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.onboardingUsersSubmit();
  } else {
    return OnboardingApi.onboardingUsers(taxCode, certified, user);
  }
};
