import {
  BusinessPnpg,
  InstitutionsPnPG,
  PnPGInstitutionLegalAddressResource,
  User,
} from '../../types';
import { InstitutionPnPGResourceArray } from '../generated/b4f-dashboard-pnpg/InstitutionPnPGResourceArray';

// TODO Actually, this user simulate the loggedUser, when login service is available, this will be removed
export const loggedUser: User = {
  taxCode: 'DLLDGI53T30I324E',
  uid: '111',
  name: 'Diego',
  surname: 'Della Valle',
  email: 'd.dellavalle@test.it',
};

export const mockedAgencies: Array<BusinessPnpg> = [
  {
    businessName: 'Ragione Sociale success',
    businessTaxId: '00000000000',
  },
  {
    businessName: 'Ragione Sociale alreadyOnboarded',
    businessTaxId: '11111111111',
  },
  {
    businessName: 'Ragione Sociale genericError',
    businessTaxId: '22222222222',
  },
];

export const mockedAgenciesAfterInsertingTaxCode: Array<BusinessPnpg> = [
  {
    businessName: '',
    businessTaxId: '33333333333',
  },
];

export const mockedInstitutionPnPG: InstitutionsPnPG = {
  businesses: mockedAgencies,
  legalTaxId: '1234567',
  requestDateTime: 'x',
};

export const mockedPnPGInstitutionsResource: InstitutionPnPGResourceArray = [
  {
    externalId: mockedAgencies[0]?.businessTaxId,
    fiscalCode: mockedAgencies[0]?.businessTaxId,
    geographicTaxonomies: [{ code: '', desc: '' }],
    id: 'test010203',
    institutionType: 'GSP',
    name: mockedAgencies[0]?.businessName,
    recipientCode: 'MDSSFDF',
    status: 'TestStatus1',
    address: 'cc',
  },
  {
    externalId: mockedAgencies[0]?.businessTaxId,
    fiscalCode: mockedAgencies[0]?.businessTaxId,
    geographicTaxonomies: [{ code: '', desc: '' }],
    id: 'test010203',
    institutionType: 'GSP',
    name: mockedAgencies[0]?.businessName,
    recipientCode: 'MDSSFDF',
    status: 'TestStatus1',
    address: 'cc',
  },
  {
    externalId: mockedAgencies[0]?.businessTaxId,
    fiscalCode: mockedAgencies[0]?.businessTaxId,
    geographicTaxonomies: [{ code: '', desc: '' }],
    id: 'test010203',
    institutionType: 'GSP',
    name: mockedAgencies[0]?.businessName,
    recipientCode: 'MDSSFDF',
    status: 'TestStatus1',
    address: 'cc',
  },
  {
    externalId: mockedAgencies[0]?.businessTaxId,
    fiscalCode: mockedAgencies[0]?.businessTaxId,
    geographicTaxonomies: [{ code: '', desc: '' }],
    id: 'test010203',
    institutionType: 'GSP',
    name: mockedAgencies[0]?.businessName,
    recipientCode: 'MDSSFDF',
    status: 'TestStatus1',
    address: 'cc',
  },
  {
    externalId: mockedAgencies[0]?.businessTaxId,
    fiscalCode: mockedAgencies[0]?.businessTaxId,
    geographicTaxonomies: [{ code: '', desc: '' }],
    id: 'test010203',
    institutionType: 'GSP',
    name: mockedAgencies[0]?.businessName,
    recipientCode: 'MDSSFDF',
    status: 'TestStatus1',
    address: 'cc',
  },
];

export const mockedRetrievedInstitutionLegalAddress: Array<PnPGInstitutionLegalAddressResource> = [
  {
    externalInstitutionId: '00000000000',
    address: 'Legal Address API retrieve, 0',
    zipCode: '03040',
  },
  {
    externalInstitutionId: '11111111111',
    address: 'Legal Address API retrieve, 1',
    zipCode: '03040',
  },
  {
    externalInstitutionId: '33333333333',
    address: 'Legal Address API retrieve, 3',
    zipCode: '03040',
  },
];

export const DashboardApi = {
  getPnPGInstitutions: async (): Promise<InstitutionPnPGResourceArray> =>
    new Promise((resolve) => resolve(mockedPnPGInstitutionsResource)),

  retrieveProductBackoffice: async (
    _productId: string,
    _institutionId: string,
    _environment?: string
  ): Promise<string> => new Promise((resolve) => resolve('mockedUrl')),

  saveInstitutionLogo: async (_institutionId: string, _logo: File): Promise<boolean> =>
    new Promise((resolve) => resolve(true)),
};
