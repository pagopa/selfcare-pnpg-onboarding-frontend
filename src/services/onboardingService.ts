import { BusinessPnpg, InstitutionsPnPG, User } from '../../types';
import { OnboardingPnPgApi } from '../api/OnboardingPnPgApiClient';
import { mockedInstitutionPnPG } from '../api/__mocks__/DashboardPnPgApiClient';

export const getInstitutionsByUser = (user: User): Promise<InstitutionsPnPG> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    return new Promise((resolve) => resolve(mockedInstitutionPnPG));
  } else {
    return OnboardingPnPgApi.getInstitutionsByUser(user);
  }
};

export const onboardingPGSubmit = (
  externalInstitutionId: string,
  productId: string,
  loggedUser: User,
  selectedInstitution: BusinessPnpg
): Promise<boolean> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_MOCK_API === 'true') {
    switch (externalInstitutionId) {
      case '00000000000':
        return new Promise((resolve) => resolve(true));
      case '11111111111':
        return new Promise((resolve) => resolve(false));
      case '22222222222':
        return new Promise((resolve) => resolve(false));
      default:
        return new Promise((resolve) => resolve(true));
    }
  } else {
    return OnboardingPnPgApi.onboardingPGSubmit(
      externalInstitutionId,
      productId,
      loggedUser,
      selectedInstitution
    );
  }
};
