import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { OnboardingApi } from '../../api/OnboardingApiClient';
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

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

test('Test: onboardingPGSubmit', async () => {
  const fetchOnboardingPGSubmit = await onboardingService.onboardingPGSubmit(
    '35467654543',
    'prod-pn-pg',
    {
      taxCode: loggedUser.taxCode ?? '',
      name: loggedUser.name ?? '',
      surname: loggedUser.surname ?? '',
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
    loggedUser.taxCode ?? '',
    storageTokenOps.read()
  )) as Response;
  const result = await fetchVerifyManager.json();
  expect(result).toMatchObject(
    expect.objectContaining({ companyName: 'Business retrieved from IC', origin: 'INFOCAMERE' })
  );

  expect(onboardingService.verifyManager).toHaveBeenCalledTimes(1);
});

test('Test: checkManager', async () => {
  const fetchCheckManager1 = await onboardingService.checkManager(
    { id: loggedUser.uid },
    '12323231321'
  );

  expect(fetchCheckManager1).toMatchObject({ result: true });

  expect(onboardingService.checkManager).toHaveBeenCalledTimes(1);

  const fetchCheckManager2 = await onboardingService.checkManager(
    { id: loggedUser.uid },
    '55555555555'
  );

  expect(fetchCheckManager2).toMatchObject({ result: false });

  expect(onboardingService.checkManager).toHaveBeenCalledTimes(2);
});

test('Test: onboardingUsersSubmit', async () => {
  const fetchOnboardingUsersSubmit = await onboardingService.onboardingUsersSubmit(
    '11223344523',
    true,
    loggedUser
  );

  expect(fetchOnboardingUsersSubmit).toBeTruthy();
});

test('Test: getInstitutionOnboardingInfo (real fetch)', async () => {
  vi.stubEnv('VITE_MOCK_API', 'false');
  const mockResponse = { ok: true, status: 200 } as Response;
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);

  const result = await onboardingService.getInstitutionOnboardingInfo(
    '12345678901',
    'prod-pn-pg',
    'test-token'
  );

  expect(result).toBe(mockResponse);
  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.stringContaining('12345678901'),
    expect.objectContaining({ method: 'GET' })
  );
});

test('Test: verifyManager (real fetch)', async () => {
  vi.stubEnv('VITE_MOCK_API', 'false');
  const mockResponse = { ok: true, status: 200 } as Response;
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(mockResponse);

  const result = await onboardingService.verifyManager('12345678901', 'TAXCODE123', 'test-token');

  expect(result).toBe(mockResponse);
  expect(globalThis.fetch).toHaveBeenCalledWith(
    expect.stringContaining('verify-manager'),
    expect.objectContaining({ method: 'POST' })
  );
});

test('Test: searchUser (real API)', async () => {
  vi.stubEnv('VITE_MOCK_API', 'false');
  vi.spyOn(OnboardingApi, 'searchUser').mockResolvedValueOnce({ id: '1' });

  const result = await onboardingService.searchUser({ taxCode: 'TESTCF123' });

  expect(result).toEqual({ id: '1' });
  expect(OnboardingApi.searchUser).toHaveBeenCalledWith({ taxCode: 'TESTCF123' });
});

test('Test: checkManager (real API)', async () => {
  vi.stubEnv('VITE_MOCK_API', 'false');
  vi.spyOn(OnboardingApi, 'checkManager').mockResolvedValueOnce({ result: true });

  const result = await onboardingService.checkManager({ id: '1' }, '12345678901');

  expect(result).toEqual({ result: true });
  expect(OnboardingApi.checkManager).toHaveBeenCalledWith('1', '12345678901');
});

test('Test: getManagerOfOnboarding (real API)', async () => {
  vi.stubEnv('VITE_MOCK_API', 'false');
  vi.spyOn(OnboardingApi, 'getManagerInfo').mockResolvedValueOnce({
    name: 'Test',
    surname: 'User',
  } as any);

  const result = await onboardingService.getManagerOfOnboarding('onboarding-id-123');

  expect(result).toEqual({ name: 'Test', surname: 'User' });
  expect(OnboardingApi.getManagerInfo).toHaveBeenCalledWith('onboarding-id-123');
});

test('Test: onboardingPGSubmit (real API)', async () => {
  vi.stubEnv('VITE_MOCK_API', 'false');
  vi.spyOn(OnboardingApi, 'onboardingPGSubmit').mockResolvedValueOnce(true);

  const result = await onboardingService.onboardingPGSubmit(
    '12345678901',
    'prod-pn-pg',
    {
      taxCode: loggedUser.taxCode ?? '',
      name: loggedUser.name ?? '',
      surname: loggedUser.surname ?? '',
      role: 'MANAGER' as RoleEnum,
      email: loggedUser.email,
    },
    {
      companyName: 'Test Business',
      companyTaxCode: '12345678901',
      origin: 'INFOCAMERE',
    },
    'test@email.com'
  );

  expect(result).toBe(true);
  expect(OnboardingApi.onboardingPGSubmit).toHaveBeenCalledTimes(1);
});

test('Test: onboardingUsersSubmit (real API)', async () => {
  vi.stubEnv('VITE_MOCK_API', 'false');
  vi.spyOn(OnboardingApi, 'onboardingUsers').mockResolvedValueOnce(true);

  const result = await onboardingService.onboardingUsersSubmit('12345678901', true, loggedUser);

  expect(result).toBe(true);
  expect(OnboardingApi.onboardingUsers).toHaveBeenCalledWith('12345678901', true, loggedUser);
});