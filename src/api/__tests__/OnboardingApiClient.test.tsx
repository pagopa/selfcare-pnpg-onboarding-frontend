import { extractResponse } from '@pagopa/selfcare-common-frontend/lib/utils/api-utils';
import { afterEach, expect, test, vi } from 'vitest';
import { loggedUser } from '../__mocks__/OnboardingApiClient';
import { RoleEnum } from '../generated/b4f-onboarding/CompanyUserDto';
import { OnboardingApi } from '../OnboardingApiClient';
import { store } from '../../redux/store';
import { createClient } from '../generated/b4f-onboarding/client';

const mockApiClient = vi.hoisted(() => ({
  verifyManagerUsingPOST: vi.fn(),
  getManagerInfo: vi.fn(),
  getActiveOnboardingUsingGET: vi.fn(),
  searchUserId: vi.fn(),
  checkManager: vi.fn(),
  institutionOnboardingCompany: vi.fn(),
  onboardingUsersPgUsingPOST: vi.fn(),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/locale/locale-utils', () => ({
  default: { t: vi.fn((key: string) => key) },
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', () => ({
  storageTokenOps: { read: vi.fn(() => 'mock-token') },
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/api-utils', () => ({
  buildFetchApi: vi.fn(() => fetch),
  extractResponse: vi.fn((_result: unknown, _status: number, _onRedirect: () => void) => _result),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice', () => ({
  appStateActions: {
    addError: vi.fn((payload: unknown) => ({ type: 'appState/addError', payload })),
  },
}));

vi.mock('../../redux/store', () => ({
  store: { dispatch: vi.fn() },
}));

vi.mock('../generated/b4f-onboarding/client', () => ({
  createClient: vi.fn(() => mockApiClient),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test('Test: withBearerAndInstitutionId adds Bearer token to request', () => {
  const [{ withDefaults }] = (createClient as ReturnType<typeof vi.fn>).mock.calls[0];
  const mockOp = vi.fn().mockReturnValue('response');
  const decorated = withDefaults(mockOp);
  decorated({ someParam: 'value' });

  expect(mockOp).toHaveBeenCalledWith({
    someParam: 'value',
    bearerAuth: 'Bearer mock-token',
  });
});

test('Test: onRedirectToLogin dispatches an error action', async () => {
  (extractResponse as ReturnType<typeof vi.fn>).mockImplementationOnce(
    (_result: unknown, _status: number, onRedirect: () => void) => {
      onRedirect();
    }
  );
  mockApiClient.verifyManagerUsingPOST.mockResolvedValueOnce({});

  await OnboardingApi.verifyManager('12345678901');

  expect(store.dispatch).toHaveBeenCalled();
});

test('Test: OnboardingApi.verifyManager', async () => {
  const mockResult = { companyName: 'Test Co', origin: 'INFOCAMERE' };
  mockApiClient.verifyManagerUsingPOST.mockResolvedValueOnce(mockResult);
  (extractResponse as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

  const result = await OnboardingApi.verifyManager('12345678901');

  expect(mockApiClient.verifyManagerUsingPOST).toHaveBeenCalledWith({
    body: { companyTaxCode: '12345678901' },
  });
  expect(result).toBe(mockResult);
});

test('Test: OnboardingApi.getManagerInfo', async () => {
  const mockResult = { name: 'Mario', surname: 'Rossi' };
  mockApiClient.getManagerInfo.mockResolvedValueOnce(mockResult);
  (extractResponse as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

  const result = await OnboardingApi.getManagerInfo('onboarding-id-123');

  expect(mockApiClient.getManagerInfo).toHaveBeenCalledWith({ onboardingId: 'onboarding-id-123' });
  expect(result).toBe(mockResult);
});

test('Test: OnboardingApi.getInstitutionOnboardingInfo', async () => {
  const mockResult = [{ institutionId: 'inst-1', businessName: 'Test' }];
  mockApiClient.getActiveOnboardingUsingGET.mockResolvedValueOnce(mockResult);
  (extractResponse as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

  const result = await OnboardingApi.getInstitutionOnboardingInfo('12345678901', 'prod-pn-pg');

  expect(mockApiClient.getActiveOnboardingUsingGET).toHaveBeenCalledWith({
    taxCode: '12345678901',
    productId: 'prod-pn-pg',
  });
  expect(result).toBe(mockResult);
});

test('Test: OnboardingApi.searchUser', async () => {
  const mockResult = { id: 'user-1' };
  mockApiClient.searchUserId.mockResolvedValueOnce(mockResult);
  (extractResponse as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

  const result = await OnboardingApi.searchUser({ taxCode: 'MCCDLL91C25B115B' });

  expect(mockApiClient.searchUserId).toHaveBeenCalledWith({
    body: { taxCode: 'MCCDLL91C25B115B' },
  });
  expect(result).toBe(mockResult);
});

test('Test: OnboardingApi.checkManager', async () => {
  const mockResult = { result: true };
  mockApiClient.checkManager.mockResolvedValueOnce(mockResult);
  (extractResponse as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

  const result = await OnboardingApi.checkManager('user-1', '12345678901');

  expect(mockApiClient.checkManager).toHaveBeenCalledWith({
    body: {
      institutionType: 'PG',
      productId: 'prod-pn-pg',
      taxCode: '12345678901',
      userId: 'user-1',
    },
  });
  expect(result).toBe(mockResult);
});

test('Test: OnboardingApi.onboardingPGSubmit', async () => {
  mockApiClient.institutionOnboardingCompany.mockResolvedValueOnce(true);
  (extractResponse as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

  const companyUser = {
    taxCode: loggedUser.taxCode ?? '',
    name: loggedUser.name ?? '',
    surname: loggedUser.surname ?? '',
    role: 'MANAGER' as RoleEnum,
    email: loggedUser.email,
  };
  const selectedBusiness = {
    companyName: 'Test Business',
    companyTaxCode: '12345678901',
    origin: 'INFOCAMERE',
  };

  const result = await OnboardingApi.onboardingPGSubmit(
    '12345678901',
    'prod-pn-pg',
    companyUser,
    selectedBusiness,
    'test@email.com'
  );

  expect(mockApiClient.institutionOnboardingCompany).toHaveBeenCalledWith({
    body: expect.objectContaining({
      productId: 'prod-pn-pg',
      taxCode: '12345678901',
      institutionType: 'PG',
    }),
  });
  expect(result).toBe(true);
});

test('Test: OnboardingApi.onboardingUsers', async () => {
  mockApiClient.onboardingUsersPgUsingPOST.mockResolvedValueOnce(true);
  (extractResponse as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

  const result = await OnboardingApi.onboardingUsers('12345678901', true, loggedUser);

  expect(mockApiClient.onboardingUsersPgUsingPOST).toHaveBeenCalledWith({
    body: expect.objectContaining({
      taxCode: '12345678901',
      certified: true,
      productId: 'prod-pn-pg',
      institutionType: 'PG',
    }),
  });
  expect(result).toBe(true);
});
