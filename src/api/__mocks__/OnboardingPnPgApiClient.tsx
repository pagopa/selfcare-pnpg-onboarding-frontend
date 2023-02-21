import {
  BusinessPnpg,
  InstitutionsPnPG,
  PnPGInstitutionLegalAddressResource,
  PnPGInstitutionResource,
  User,
} from '../../../types';

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
  {
    externalId: '55555555555',
    category: 'test3',
    fiscalCode: '55555555555',
    geographicTaxonomies: [],
    id: 'test030203',
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
    id: 'test030203',
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
    externalInstitutionId: '77777777777',
    address: 'Via retrievedInstitutionLegalAddress1',
    zipCode: '98765',
  },
  {
    externalInstitutionId: '88888888888',
    address: 'Via retrievedInstitutionLegalAddress2',
    zipCode: '56789',
  },
];

export const mockedEdAOccurrences = [
  {
    externalId: '55555555555',
    address: 'via test 3',
    category: 'test3',
    fiscalCode: '55555555555',
    geographicTaxonomies: [],
    id: 'test030203',
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
    id: 'test030203',
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

export const mockedOnboardingPnPgApi = {
  getInstitutionsByUser: async (_loggedUser: User): Promise<InstitutionsPnPG> =>
    new Promise((resolve) => resolve(mockedInstitutionPnPG)),

  onboardingPGSubmit: (
    externalInstitutionId: string,
    _productId: string,
    _loggedUser: User,
    _selectedInstitution: BusinessPnpg
  ): Promise<boolean> => {
    if (externalInstitutionId === '11111111111') {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status! Expected 201 obtained 400`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpStatus = 400;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpBody = {
          statusCode: 400,
          description: 'Bad Request',
        };
        console.error(JSON.stringify(error));
        throw error;
      });
    } else if (externalInstitutionId === '22222222222') {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status! Expected 201 obtained 404`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpStatus = 404;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpBody = {
          statusCode: 404,
          description: 'Not found',
        };
        console.error(JSON.stringify(error));
        throw error;
      });
    }
    return new Promise((resolve) => resolve(true));
  },

  matchInstitutionAndUser: (externalInstitutionId: string, _loggedUser: User): Promise<boolean> => {
    const matchedPartyInEdAByExternalId = mockedEdA.find(
      (p) => p.externalId === externalInstitutionId
    );
    return new Promise((resolve) => resolve(matchedPartyInEdAByExternalId ? true : false));
  },

  getInstitutionLegalAddress: (
    externalInstitutionId: string
  ): Promise<PnPGInstitutionLegalAddressResource> => {
    const matchedInstitutionLegalAddressByExternalId = mockedRetrievedInstitutionLegalAddress.find(
      (i) => i.externalInstitutionId === externalInstitutionId
    );
    if (matchedInstitutionLegalAddressByExternalId) {
      return new Promise((resolve) => resolve(matchedInstitutionLegalAddressByExternalId));
    } else {
      return new Promise((resolve) =>
        resolve({ address: '', externalInstitutionId: '', zipCode: '' })
      );
    }
  },
};
