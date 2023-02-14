import { BusinessPnpg, InstitutionsPnPG, PnPGInstitutionResource, User } from '../../../types';

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
  {
    externalId: mockedAgencies[2]?.businessTaxId,
    address: 'via test 3',
    category: 'test3',
    fiscalCode: mockedAgencies[2]?.businessTaxId,
    geographicTaxonomies: [],
    id: 'test030203',
    institutionType: 'GSP',
    mailAddress: 'test@comuneditest.it',
    name: mockedAgencies[2]?.businessName,
    origin: 'testorigin3',
    originId: 'testoriginId3',
    recipientCode: 'MDSSFDF',
    status: 'TestStatus3',
    userRole: 'UserRoleTest3',
    zipCode: '32145',
  },
];

export const DashboardApi = {
  getInstitutionsByUser: async (_loggedUser: User): Promise<InstitutionsPnPG> =>
    new Promise((resolve) => resolve(mockedInstitutionPnPG)),

  onboardingPGSubmit: async (
    _externalInstitutionId: string,
    _productId: string,
    _loggedUser: User,
    _selectedInstitution: BusinessPnpg
  ): Promise<boolean> => new Promise((resolve) => resolve(true)),
};
