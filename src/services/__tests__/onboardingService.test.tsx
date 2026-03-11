import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { vi } from 'vitest';
import { loggedUser } from '../../api/__mocks__/OnboardingApiClient';
import { RoleEnum } from '../../api/generated/b4f-onboarding/CompanyUserDto';
import * as onboardingService from '../onboardingService';

beforeEach(() => {
  vi.spyOn(onboardingService, 'onboardingPGSubmit');
  vi.spyOn(onboardingService, 'verifyManager');
  vi.spyOn(onboardingService, 'checkManager');
  vi.spyOn(onboardingService, 'onboardingUsersSubmit');
  vi.spyOn(onboardingService, 'getInstitutionOnboardingInfo');
});

test('Test: onboardingPGSubmit', async () => {
  const fetchOnboardingPGSubmit = await onboardingService.onboardingPGSubmit(
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

  expect(onboardingService.onboardingPGSubmit).toHaveBeenCalledTimes(1);
});

test('Test: verifyManager', async () => {
  const fetchVerifyManager = (await onboardingService.verifyManager(
    '12323231321',
    loggedUser.taxCode,
    storageTokenOps.read()
  )) as Response;
  const result = await fetchVerifyManager.json();
  expect(result).toMatchObject(
    expect.objectContaining({ companyName: 'Business retrieved from IC', origin: 'INFOCAMERE' })
  );

  expect(onboardingService.verifyManager).toHaveBeenCalledTimes(1);
});

test('Test: checkManager', async () => {
  const fetchCheckManager1 = await onboardingService.checkManager({ id: loggedUser.uid }, '12323231321');

  expect(fetchCheckManager1).toMatchObject({ result: true });

  expect(onboardingService.checkManager).toHaveBeenCalledTimes(1);

  const fetchCheckManager2 = await onboardingService.checkManager({ id: loggedUser.uid }, '55555555555');

  expect(fetchCheckManager2).toMatchObject({ result: false });

  expect(onboardingService.checkManager).toHaveBeenCalledTimes(2);
});

test('Test: onboardingUsersSubmit', async () => {
  const fetchOnboardingUsersSubmit = await onboardingService.onboardingUsersSubmit('11223344523', true, loggedUser);

  expect(fetchOnboardingUsersSubmit).toBeTruthy();
});