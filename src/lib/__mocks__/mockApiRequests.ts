import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BusinessPnpg, Endpoint, InstitutionsPnPG } from '../../../types';

export const mockedAgencies: Array<BusinessPnpg> = [
  {
    businessName: '[Ragione Sociale]',
    businessTaxId: '00000000000',
  },
  {
    businessName: '[Ragione Sociale]',
    businessTaxId: '11111111111',
  },
];

export const mockedInstitutionPnPG: InstitutionsPnPG = {
  businesses: mockedAgencies,
  legalTaxId: '1234567',
  requestDateTime: 'x',
};

export async function mockFetch(
  { endpoint, endpointParams }: Endpoint,
  { params }: AxiosRequestConfig
): Promise<AxiosResponse | AxiosError> {
  if (endpoint === 'GET_INSTITUTIONS_BY_USER_ID') {
    return new Promise((resolve) =>
      resolve({ data: mockedInstitutionPnPG, status: 200, statusText: '200' } as AxiosResponse)
    );
  }

  const msg = `NOT MOCKED REQUEST! {endpoint: ${endpoint}, endpointParams: ${JSON.stringify(
    endpointParams
  )}, params: ${JSON.stringify(params)}}`;
  console.error(msg);
  throw new Error(msg);
}
