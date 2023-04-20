import { InstitutionsPnpg, PnpgInstitutionLegalAddressResource, User } from '../../types';
import { BusinessPnPGResource } from '../generated/b4f-onboarding-pnpg/BusinessPnPGResource';

export const loggedUser: User = {
  uid: '00123',
  email: 'email.test@mocked.com',
  name: 'mockedUserName',
  surname: 'mockedUserSurname',
  taxCode: 'MCCDLL91C25B115B',
};

export const mockedAgencies: Array<BusinessPnPGResource> = [
  {
    businessName: 'BusinessName success',
    businessTaxId: '01113570442',
  },
  {
    businessName: 'BusinessName alreadyOnboarded',
    businessTaxId: '01501320442',
  },
  {
    businessName: 'BusinessName genericError',
    businessTaxId: '22222222222',
  },
];

export const mockedInstitutionPnPG: InstitutionsPnpg = {
  businesses: mockedAgencies,
  legalTaxId: '1234567',
  requestDateTime: 'x',
};

export const mockedRetrievedInstitutionLegalAddress: Array<PnpgInstitutionLegalAddressResource> = [
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

export const mockedOnboardingPnPgApi = {
  getInstitutionsByUser: async (_loggedUser: User): Promise<InstitutionsPnpg> =>
    new Promise((resolve) => resolve(mockedInstitutionPnPG)),

  onboardingPGSubmit: (externalInstitutionId: string): Promise<boolean> => {
    if (externalInstitutionId === '01501320442') {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status! Expected 201 obtained 400`);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpStatus = 409;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line functional/immutable-data
        error.httpBody = {
          statusCode: 409,
          description: 'Conflict Error',
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
    const matchedPartyInEdAByExternalId = mockedEdAOccurrences.find(
      (p) => p.externalId === externalInstitutionId
    );
    if (matchedPartyInEdAByExternalId) {
      return new Promise((resolve) => resolve(true));
    } else {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status!! Expected 200 obtained 400`);
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
    }
  },

  getInstitutionLegalAddress: (
    externalInstitutionId: string
  ): Promise<PnpgInstitutionLegalAddressResource> => {
    const matchedInstitutionLegalAddressByExternalId = mockedRetrievedInstitutionLegalAddress.find(
      (i) => i.externalInstitutionId === externalInstitutionId
    );
    if (matchedInstitutionLegalAddressByExternalId) {
      return new Promise((resolve) => resolve(matchedInstitutionLegalAddressByExternalId));
    } else {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status! Expected 200 obtained 400`);
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
    }
  },
};
