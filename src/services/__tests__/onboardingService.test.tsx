import { OnboardingPnPgApi } from '../../api/OnboardingPnPgApiClient';
import { loggedUser } from '../../api/__mocks__/OnboardingPnPgApiClient';
import { mockedAgencies } from '../../api/__mocks__/OnboardingPnPgApiClient';
import {
  getInstitutionLegalAddress,
  onboardingPGSubmit,
  matchInstitutionAndUser,
  getInstitutionsByUser,
} from '../onboardingService';

const dashboardApiGetInstitutionsSpy = jest.spyOn(OnboardingPnPgApi, 'getInstitutionsByUser');

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
});

test('Test: getInstitutionLegalAddress', async () => {
  const fetchGetInstitutionLegalAddress = await getInstitutionLegalAddress('77777777777');

  expect(fetchGetInstitutionLegalAddress).toMatchObject({
    externalInstitutionId: '77777777777',
    address: 'Via retrievedInstitutionLegalAddress1',
    zipCode: '98765',
  });
});

test('Test: onboardingPGSubmit', async () => {
  const fetchOnboardingPGSubmit = await onboardingPGSubmit(
    '00000000000',
    'prod-pn-pg',
    loggedUser,
    mockedAgencies[0]
  );

  expect(fetchOnboardingPGSubmit).toBeTruthy();
});

test('Test: matchInstitutionAndUser', async () => {
  const fetchMatchInstitutionAndUser = await matchInstitutionAndUser('55555555555', loggedUser);

  expect(fetchMatchInstitutionAndUser).toBeTruthy();
});
