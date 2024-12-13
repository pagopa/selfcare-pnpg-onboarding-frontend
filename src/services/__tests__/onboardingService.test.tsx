import { loggedUser } from '../../api/__mocks__/OnboardingApiClient';
import { RoleEnum } from '../../api/generated/b4f-onboarding/CompanyUserDto';
import {
  checkManager,
  getInstitutionOnboardingInfo,
  onboardingPGSubmit,
  onboardingUsersSubmit,
  verifyManager,
} from '../onboardingService';

beforeEach(() => {
  jest.spyOn(require('../onboardingService'), 'onboardingPGSubmit');
  jest.spyOn(require('../onboardingService'), 'verifyManager');
  jest.spyOn(require('../onboardingService'), 'checkManager');
  jest.spyOn(require('../onboardingService'), 'onboardingUsersSubmit');
  jest.spyOn(require('../onboardingService'), 'getInstitutionOnboardingInfo');
});

test('Test: onboardingPGSubmit', async () => {
  const fetchOnboardingPGSubmit = await onboardingPGSubmit(
    '35467654543',
    'prod-pn-pg',
    {
      taxCode: loggedUser.taxCode,
      name: loggedUser.name,
      surname: loggedUser.surname,
      role: 'MANAGER' as RoleEnum,
      email: loggedUser.email,
    },
    {
      companyName: 'mockedBusiness1',
      companyTaxCode: '35467654543',
      origin: 'INFOCAMERE',
    },
    'mockedemail@mock.it'
  );

  expect(fetchOnboardingPGSubmit).toBeTruthy();

  expect(onboardingPGSubmit).toBeCalledTimes(1);
});

test('Test: verifyManager', async () => {
  const fetchVerifyManager = await verifyManager('12323231321', loggedUser.taxCode);

  expect(fetchVerifyManager).toMatchObject(
    expect.objectContaining({ companyName: 'Business retrieved from IC', origin: 'INFOCAMERE' })
  );

  expect(verifyManager).toBeCalledTimes(1);
});

test('Test: checkManager', async () => {
  const fetchCheckManager1 = await checkManager(loggedUser, '12323231321');

  expect(fetchCheckManager1).toMatchObject({ result: true });

  expect(checkManager).toBeCalledTimes(1);

  const fetchCheckManager2 = await checkManager(loggedUser, '55555555555');

  expect(fetchCheckManager2).toMatchObject({ result: false });

  expect(checkManager).toBeCalledTimes(2);
});

test('Test: onboardingUsersSubmit', async () => {
  const fetchOnboardingUsersSubmit = await onboardingUsersSubmit('11223344523', true, loggedUser);

  expect(fetchOnboardingUsersSubmit).toBeTruthy();
});
