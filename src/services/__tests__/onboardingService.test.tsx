import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { vi } from 'vitest';
import { loggedUser } from '../../api/__mocks__/OnboardingApiClient';
import { RoleEnum } from '../../api/generated/b4f-onboarding/CompanyUserDto';
import {
  checkManager,
  onboardingPGSubmit,
  onboardingUsersSubmit,
  verifyManager
} from '../onboardingService';

beforeEach(() => {
  vi.spyOn(require('../onboardingService'), 'onboardingPGSubmit');
  vi.spyOn(require('../onboardingService'), 'verifyManager');
  vi.spyOn(require('../onboardingService'), 'checkManager');
  vi.spyOn(require('../onboardingService'), 'onboardingUsersSubmit');
  vi.spyOn(require('../onboardingService'), 'getInstitutionOnboardingInfo');
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

  expect(onboardingPGSubmit).toHaveBeenCalledTimes(1);
});

test('Test: verifyManager', async () => {
  const fetchVerifyManager = (await verifyManager(
    '12323231321',
    loggedUser.taxCode,
    storageTokenOps.read()
  )) as Response;
  const result = await fetchVerifyManager.json();
  expect(result).toMatchObject(
    expect.objectContaining({ companyName: 'Business retrieved from IC', origin: 'INFOCAMERE' })
  );

  expect(verifyManager).toHaveBeenCalledTimes(1);
});

test('Test: checkManager', async () => {
  const fetchCheckManager1 = await checkManager({ id: loggedUser.uid }, '12323231321');

  expect(fetchCheckManager1).toMatchObject({ result: true });

  expect(checkManager).toHaveBeenCalledTimes(1);

  const fetchCheckManager2 = await checkManager({ id: loggedUser.uid }, '55555555555');

  expect(fetchCheckManager2).toMatchObject({ result: false });

  expect(checkManager).toHaveBeenCalledTimes(2);
});

test('Test: onboardingUsersSubmit', async () => {
  const fetchOnboardingUsersSubmit = await onboardingUsersSubmit('11223344523', true, loggedUser);

  expect(fetchOnboardingUsersSubmit).toBeTruthy();
});
