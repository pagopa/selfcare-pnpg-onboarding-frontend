import {
  BusinessPnpg,
  InstitutionsPnPG,
  PnPGInstitutionLegalAddressResource,
  PnPGInstitutionResource,
  User,
} from '../../../types';

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

export const mockedInstitutionPnPG: InstitutionsPnPG = {
  businesses: mockedAgencies,
  legalTaxId: '1234567',
  requestDateTime: 'x',
};

export const mockedPnPGInstitutionsResource: Array<PnPGInstitutionResource> = [
  {
    externalId: mockedAgencies[0]?.businessTaxId,
    category: 'test1',
    fiscalCode: mockedAgencies[0]?.businessTaxId,
    geographicTaxonomies: [],
    id: mockedAgencies[0]?.businessTaxId,
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
    category: 'test2',
    fiscalCode: mockedAgencies[1]?.businessTaxId,
    geographicTaxonomies: [],
    id: mockedAgencies[1]?.businessTaxId,
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
  {
    externalId: mockedAgencies[2]?.businessTaxId,
    category: 'test3',
    fiscalCode: mockedAgencies[2]?.businessTaxId,
    geographicTaxonomies: [],
    id: mockedAgencies[2]?.businessTaxId,
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgencies[2]?.businessName,
    origin: 'testorigin3',
    originId: 'testoriginId3',
    recipientCode: 'MDSSFDF',
    status: 'TestStatusAfterinsertingTaxCode44',
    userRole: 'UserRoleTestAfterinsertingTaxCode44',
    zipCode: '15432',
  },
  {
    externalId: '55555555555',
    category: 'test3',
    fiscalCode: '55555555555',
    geographicTaxonomies: [],
    id: '55555555555',
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: 'retrieved in EdA mock 1',
    origin: 'testorigin3',
    originId: 'testoriginId3',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus3',
    userRole: 'UserRoleTest3',
    zipCode: '32145',
  },
  {
    externalId: '66666666666',
    category: 'test3',
    fiscalCode: '66666666666',
    geographicTaxonomies: [],
    id: '66666666666',
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: 'retrieved in EdA mock 2',
    origin: 'testorigin3',
    originId: 'testoriginId3',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus3',
    userRole: 'UserRoleTest3',
    zipCode: '32145',
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
