import { loggedUser } from '../../api/__mocks__/OnboardingPnPgApiClient';
import { mockedAgencies } from '../../api/__mocks__/OnboardingPnPgApiClient';
import {
  getInstitutionLegalAddress,
  onboardingPGSubmit,
  matchInstitutionAndUser,
  getInstitutionsByUser,
} from '../onboardingService';

beforeEach(() => {
  jest.spyOn(require('../onboardingService'), 'getInstitutionsByUser');
  jest.spyOn(require('../onboardingService'), 'getInstitutionLegalAddress');
  jest.spyOn(require('../onboardingService'), 'onboardingPGSubmit');
  jest.spyOn(require('../onboardingService'), 'matchInstitutionAndUser');
});

test('Test: getInstitutionsByUser', async () => {
  const fetchGetInstitutionsByUser = await getInstitutionsByUser({
    uid: loggedUser.uid,
    email: loggedUser.email,
    name: loggedUser.name,
    surname: loggedUser.surname,
    taxCode: loggedUser.taxCode,
  });

  expect(fetchGetInstitutionsByUser).toMatchObject({
    businesses: [
      { businessName: 'BusinessName success', businessTaxId: '01113570442' },
      { businessName: 'BusinessName alreadyOnboarded', businessTaxId: '01501320442' },
      { businessName: 'BusinessName genericError', businessTaxId: '22222222222' },
    ],
    legalTaxId: '1234567',
    requestDateTime: 'x',
  });

  expect(getInstitutionsByUser).toBeCalledTimes(1);
});

test('Test: getInstitutionLegalAddress', async () => {
  const fetchGetInstitutionLegalAddress = await getInstitutionLegalAddress('77777777777');

  expect(fetchGetInstitutionLegalAddress).toMatchObject({
    externalInstitutionId: '77777777777',
    address: 'Via retrievedInstitutionLegalAddress1',
    zipCode: '98765',
  });

  expect(getInstitutionLegalAddress).toBeCalledTimes(1);
});

test('Test: onboardingPGSubmit', async () => {
  const fetchOnboardingPGSubmit = await onboardingPGSubmit(
    '00000000000',
    'prod-pn-pg',
    loggedUser,
    mockedAgencies[0]
  );

  expect(fetchOnboardingPGSubmit).toBeTruthy();

  expect(onboardingPGSubmit).toBeCalledTimes(1);
});

test('Test: matchInstitutionAndUser', async () => {
  const fetchMatchInstitutionAndUser = await matchInstitutionAndUser('55555555555', loggedUser);

  expect(fetchMatchInstitutionAndUser).toBeTruthy();

  expect(matchInstitutionAndUser).toBeCalledTimes(1);
});
