import { Company, User } from '../types';
import { OnboardingApi } from '../api/OnboardingApiClient';
import { mockedOnboardingApi } from '../api/__mocks__/OnboardingApiClient';
import { CompanyUserDto, RoleEnum } from '../api/generated/b4f-onboarding/CompanyUserDto';
import { InstitutionOnboardingResource } from '../api/generated/b4f-onboarding/InstitutionOnboardingResource';
import { CheckManagerResponse } from '../api/generated/b4f-onboarding/CheckManagerResponse';
import { VerifyManagerResponse } from '../api/generated/b4f-onboarding/VerifyManagerResponse';

export const getInstitutionOnboardingInfo = (
  taxCode: string,
  productId: string
): Promise<Array<InstitutionOnboardingResource>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.getInstitutionOnboardingInfo(taxCode);
  } else {
    return OnboardingApi.getInstitutionOnboardingInfo(taxCode, productId);
  }
};

export const verifyManager = async (
  companyTaxCode: string,
  userTaxCode: string
): Promise<VerifyManagerResponse> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.verifyManager(companyTaxCode, userTaxCode);
  } else {
    return OnboardingApi.verifyManager(companyTaxCode, userTaxCode);
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
  user: CompanyUserDto | User
): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.onboardingUsersSubmit();
  } else {
    return OnboardingApi.onboardingUsers(taxCode, certified, user);
  }
};
