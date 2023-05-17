import { RoleEnum } from '../../api/generated/b4f-onboarding-pnpg/PnPGUserDto';
import { loggedUser } from '../../api/__mocks__/OnboardingApiClient';
import { mockedBusinesses } from '../../api/__mocks__/OnboardingApiClient';
import {
  getBusinessLegalAddress,
  onboardingPGSubmit,
  matchBusinessAndUser,
  getBusinessesByUser,
} from '../onboardingService';

beforeEach(() => {
  jest.spyOn(require('../onboardingService'), 'getBusinessesByUser');
  jest.spyOn(require('../onboardingService'), 'getBusinessLegalAddress');
  jest.spyOn(require('../onboardingService'), 'onboardingPGSubmit');
  jest.spyOn(require('../onboardingService'), 'matchBusinessAndUser');
});

test('Test: getBusinessesByUser', async () => {
  const fetchGetBusinessesByUser = await getBusinessesByUser({
    uid: loggedUser.uid,
    email: loggedUser.email,
    name: loggedUser.name,
    surname: loggedUser.surname,
    taxCode: loggedUser.taxCode,
  });

  expect(fetchGetBusinessesByUser).toMatchObject({
    businesses: [
      { businessName: 'BusinessName success', businessTaxId: '01113570442' },
      { businessName: 'BusinessName alreadyOnboarded', businessTaxId: '01501320442' },
      { businessName: 'BusinessName genericError', businessTaxId: '22222222222' },
    ],
    legalTaxId: '1234567',
    requestDateTime: 'x',
  });

  expect(getBusinessesByUser).toBeCalledTimes(1);
});

test('Test: getBusinessLegalAddress', async () => {
  const fetchGetBusinessLegalAddress = await getBusinessLegalAddress('77777777777');

  expect(fetchGetBusinessLegalAddress).toMatchObject({
    taxCode: '77777777777',
    address: 'Via retrievedInstitutionLegalAddress1',
    zipCode: '98765',
  });

  expect(getBusinessLegalAddress).toBeCalledTimes(1);
});

test('Test: onboardingPGSubmit', async () => {
  const fetchOnboardingPGSubmit = await onboardingPGSubmit(
    mockedBusinesses[0].businessTaxId,
    'prod-pn-pg',
    {
      taxCode: loggedUser.taxCode,
      name: loggedUser.name,
      surname: loggedUser.surname,
      role: 'MANAGER' as RoleEnum,
      email: loggedUser.email,
    },
    {
      businessName: mockedBusinesses[0].businessName,
      businessTaxId: mockedBusinesses[0].businessTaxId,
      certified: false,
    },
    'mockedemail@mock.it'
  );

  expect(fetchOnboardingPGSubmit).toBeTruthy();

  expect(onboardingPGSubmit).toBeCalledTimes(1);
});

test('Test: matchBusinessAndUser', async () => {
  const fetchMatchBusinessAndUser = await matchBusinessAndUser('55555555555', loggedUser);

  expect(fetchMatchBusinessAndUser).toBeTruthy();

  expect(matchBusinessAndUser).toBeCalledTimes(1);
});
