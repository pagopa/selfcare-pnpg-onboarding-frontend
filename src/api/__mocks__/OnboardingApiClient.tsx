import { LegalEntity, BusinessLegalAddress, User } from '../../types';
import { BusinessResourceIC } from '../generated/b4f-onboarding-pnpg/BusinessResourceIC';
import { InstitutionLegalAddressResource } from '../generated/b4f-onboarding-pnpg/InstitutionLegalAddressResource';
import { MatchInfoResultResource } from '../generated/b4f-onboarding-pnpg/MatchInfoResultResource';

export const loggedUser: User = {
  uid: '00123',
  name: 'mockedUserName',
  surname: 'mockedUserSurname',
  taxCode: 'MCCDLL91C25B115B',
  email: 'email@mockemail.com',
};

export const mockedBusinesses: Array<BusinessResourceIC> = [
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

export const mockedLegalEntity: LegalEntity = {
  businesses: mockedBusinesses,
  legalTaxId: '1234567',
  requestDateTime: 'x',
};

export const mockedRetrievedBusinessesLegalAddress: Array<BusinessLegalAddress> = [
  {
    taxCode: '77777777777',
    address: 'Via retrievedInstitutionLegalAddress1',
    zipCode: '98765',
  },
  {
    taxCode: '88888888888',
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

export const mockedOnboardingApi = {
  getBusinessesByUser: async (_loggedUser: User): Promise<LegalEntity> =>
    new Promise((resolve) => resolve(mockedLegalEntity)),

  onboardingPGSubmit: (businessId: string): Promise<boolean> => {
    if (businessId === '01501320442') {
      return new Promise(() => {
        const error = new Error(`Unexpected mocked HTTP status! Expected 201 obtained 409`);
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
    } else if (businessId === '22222222222') {
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

  matchBusinessAndUser: (taxCode: string, _loggedUser: User): Promise<MatchInfoResultResource> => {
    const matchedBusinessInEdAByExternalId = mockedEdAOccurrences.find(
      (p) => p.externalId === taxCode
    );
    if (matchedBusinessInEdAByExternalId) {
      return new Promise((resolve) => resolve({ verificationResult: true }));
    } else {
      return new Promise((resolve) => resolve({ verificationResult: false }));
    }
  },

  getBusinessLegalAddress: (taxCode: string): Promise<InstitutionLegalAddressResource | null> => {
    const matchedBusinessLegalAddressByExternalId = mockedRetrievedBusinessesLegalAddress.find(
      (i) => i.taxCode === taxCode
    );
    if (matchedBusinessLegalAddressByExternalId) {
      return new Promise((resolve) => resolve(matchedBusinessLegalAddressByExternalId));
    } else {
      return new Promise((resolve) => resolve(null));
    }
  },
};
