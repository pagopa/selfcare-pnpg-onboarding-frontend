import { BusinessPnpg, InstitutionsPnPG, PnPGInstitutionResource, User } from '../../../types';

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

export const mockedPnPGInstitutionsResource: Array<PnPGInstitutionResource> = [
  {
    externalId: mockedAgencies[0].businessTaxId,
    address: 'via test 1',
    category: 'test1',
    fiscalCode: mockedAgencies[0].businessTaxId,
    geographicTaxonomies: [],
    id: mockedAgencies[0].businessTaxId,
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgencies[0].businessName,
    origin: 'testorigin1',
    originId: 'testoriginId1',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus1',
    userRole: 'UserRoleTest1',
    zipCode: '12345',
  },
  {
    externalId: mockedAgencies[1].businessTaxId,
    address: 'via test 2',
    category: 'test2',
    fiscalCode: mockedAgencies[1].businessTaxId,
    geographicTaxonomies: [],
    id: mockedAgencies[1].businessTaxId,
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgencies[1].businessName,
    origin: 'testorigin2',
    originId: 'testoriginId2',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus2',
    userRole: 'UserRoleTest2',
    zipCode: '54321',
  },
  {
    externalId: mockedAgencies[2].businessTaxId,
    address: 'via test 3',
    category: 'test3',
    fiscalCode: mockedAgencies[2].businessTaxId,
    geographicTaxonomies: [],
    id: mockedAgencies[2].businessTaxId,
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgencies[2].businessName,
    origin: 'testorigin3',
    originId: 'testoriginId3',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus3',
    userRole: 'UserRoleTest3',
    zipCode: '32145',
  },
  // USE CASE INTRODUCED WHEN RELATED ENTITIES ARE NOT FOUND
  {
    externalId: mockedAgenciesAfterInsertingTaxCode[0]?.businessTaxId,
    address: 'via test after inserting taxCode, 4',
    category: 'testAfterinsertingTaxCode4',
    fiscalCode: mockedAgenciesAfterInsertingTaxCode[0]?.businessTaxId,
    geographicTaxonomies: [],
    id: mockedAgenciesAfterInsertingTaxCode[0]?.businessTaxId,
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgenciesAfterInsertingTaxCode[0]?.businessName,
    origin: 'testOriginAfterinsertingTaxCode4',
    originId: 'testOriginIdAfterInsertingTaxCode4',
    recipientCode: 'MDSSFDF',
    status: 'TestStatusAfterinsertingTaxCode44',
    userRole: 'UserRoleTestAfterinsertingTaxCode44',
    zipCode: '15432',
  },
];

export const mockedRetrievedInstitutionLegalAddress = {
  externalInstitutionId: '33333333333',
  address: 'Legal Address API retrieve, 1',
  zipCode: '03040',
};

export const DashboardApi = {
  getPnPGInstitutions: async (): Promise<Array<PnPGInstitutionResource>> =>
    new Promise((resolve) => resolve(mockedPnPGInstitutionsResource)),

  retrieveProductBackoffice: async (
    _productId: string,
    _institutionId: string,
    _environment?: string
  ): Promise<string> => new Promise((resolve) => resolve('mockedUrl')),

  saveInstitutionLogo: async (_institutionId: string, _logo: File): Promise<boolean> =>
    new Promise((resolve) => resolve(true)),
};
