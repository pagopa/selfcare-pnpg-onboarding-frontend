import { Business, LegalEntity, User } from '../types';
import { OnboardingApi } from '../api/OnboardingApiClient';
import { mockedOnboardingApi } from '../api/__mocks__/OnboardingApiClient';
import { mockedLegalEntity } from '../api/__mocks__/OnboardingApiClient';
import { MatchInfoResultResource } from '../api/generated/b4f-onboarding/MatchInfoResultResource';
import { InstitutionLegalAddressResource } from '../api/generated/b4f-onboarding/InstitutionLegalAddressResource';
import { CompanyUserDto, RoleEnum } from '../api/generated/b4f-onboarding/CompanyUserDto';
import { InstitutionOnboardingResource } from '../api/generated/b4f-onboarding/InstitutionOnboardingResource';

export const getBusinessesByUser = (): Promise<LegalEntity> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve(mockedLegalEntity));
  } else {
    return OnboardingApi.getBusinessesByUser();
  }
};

export const matchBusinessAndUser = (
  businessId: string,
  loggedUser: User
): Promise<MatchInfoResultResource> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.matchBusinessAndUser(businessId, loggedUser);
  } else {
    return OnboardingApi.matchBusinessAndUser(businessId, loggedUser);
  }
};

export const getBusinessLegalAddress = (
  businessId: string
): Promise<InstitutionLegalAddressResource | null> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return mockedOnboardingApi.getBusinessLegalAddress(businessId);
  } else {
    return OnboardingApi.getBusinessLegalAddress(businessId);
  }
};

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

export const checkManager = (loggedUser: User, taxCode?: string): Promise<boolean> => {
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
  selectedInstitution: Business,
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
