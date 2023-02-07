import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BusinessPnpg, Endpoint, InstitutionsPnPG, PnPGInstitutionResource } from '../../../types';

export const mockedAgencies: Array<BusinessPnpg> = [
  {
    businessName: 'Ragione Sociale Test 1',
    businessTaxId: '00000000000',
  },
  {
    businessName: 'Ragione Sociale Test 2',
    businessTaxId: '11111111111',
  },
];

export const mockedInstitutionPnPG: InstitutionsPnPG = {
  businesses: mockedAgencies,
  legalTaxId: '1234567',
  requestDateTime: 'x',
};

export const mockedPnPGInstitutionsResource: Array<PnPGInstitutionResource> = [
  {
    externalId: mockedAgencies[0]?.businessTaxId,
    address: 'via test 1',
    category: 'test1',
    fiscalCode: mockedAgencies[0]?.businessTaxId,
    geographicTaxonomies: [],
    id: 'test010203',
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgencies[0]?.businessName,
    origin: 'testorigin1',
    originId: 'testoriginId1',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus1',
    userRole: 'UserRoleTest1',
    zipCode: '12345',
  },
  {
    externalId: mockedAgencies[1]?.businessTaxId,
    address: 'via test 2',
    category: 'test2',
    fiscalCode: mockedAgencies[1]?.businessTaxId,
    geographicTaxonomies: [],
    id: 'test020203',
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgencies[1]?.businessName,
    origin: 'testorigin2',
    originId: 'testoriginId2',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus2',
    userRole: 'UserRoleTest2',
    zipCode: '54321',
  },
];

const genericError: Promise<AxiosError> = new Promise((resolve) =>
  resolve({
    isAxiosError: true,
    response: { data: '', status: 400, statusText: '400' },
  } as AxiosError)
);

export async function mockFetch(
  { endpoint, endpointParams }: Endpoint,
  { params }: AxiosRequestConfig
): Promise<AxiosResponse | AxiosError> {
  if (endpoint === 'GET_INSTITUTIONS_BY_USER_ID') {
    return new Promise((resolve) =>
      resolve({ data: mockedInstitutionPnPG, status: 200, statusText: '200' } as AxiosResponse)
    );
  }

  if (endpoint === 'ONBOARDING_PNPG_SUBMIT') {
    switch (endpointParams.externalInstitutionId) {
      case '00000000000':
        return new Promise((resolve) =>
          resolve({ data: '', status: 201, statusText: '201' } as AxiosResponse)
        );
      case '11111111111':
        return genericError;
    }
  }

  if (endpoint === 'DASHBOARD_GET_INSTITUTIONS') {
    return new Promise((resolve) =>
      resolve({
        data: mockedPnPGInstitutionsResource,
        status: 200,
        statusText: '200',
      } as AxiosResponse)
    );
  }

  const msg = `NOT MOCKED REQUEST! {endpoint: ${endpoint}, endpointParams: ${JSON.stringify(
    endpointParams
  )}, params: ${JSON.stringify(params)}}`;
  console.error(msg);
  throw new Error(msg);
}
